import express from "express";
import pkg from "@prisma/client";
import morgan from "morgan";
import cors from "cors";
import { auth } from  'express-oauth2-jwt-bearer'
import * as dotenv from 'dotenv'
dotenv.config()

const requireAuth = auth({
  audience: process.env.AUTH0_AUDIENCE,
  issuerBaseURL: process.env.AUTH0_ISSUER,
  tokenSigningAlg: 'RS256'
});

const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan("dev"));

const { PrismaClient } = pkg;
const prisma = new PrismaClient();

app.get("/ping", (req, res) => {
  res.send("pong");
});

// verify user status, if not registered in our database we will create it
app.post("/verify-user", requireAuth, async (req, res) => {
    const auth0Id = req.auth.payload.sub;
    const email = req.auth.payload[`${process.env.AUTH0_AUDIENCE}/email`];
    const name = req.auth.payload[`${process.env.AUTH0_AUDIENCE}/name`];

    const user = await prisma.user.findUnique({
      where: {
        auth0Id,
      },
    });
  
    if (user) {
      res.json(user);
    } else {
      const newUser = await prisma.user.create({
        data: {
          email,
          auth0Id,
          name,
        },
      });
  
      res.json(newUser);
    }
  });

// get an user by user id
app.get("/users/:userId", async (req, res) => {
  const userId = req.params.userId;
  const user = await prisma.user.findUnique({
    where: {
      auth0Id: userId,
    }
  })
  if (!user){
    return res.status(404).json({error: "User Not Found"});
  }
  res.json(user);
})

//add new movies
app.post("/details", async (req, res) => {
  const { tmdbID, title, year, poster, plot, tmdbRating } = req.body;

  const movie = await prisma.movie.findUnique({
    where: {
      tmdbID,
    },
  });
  if(movie) {
    res.json(movie);
  } else {
    const newMovie = await prisma.movie.create({
      data: {
        tmdbID, 
        title, 
        year, 
        poster, 
        plot, 
        tmdbRating,
      },
    });
    res.json(newMovie);
  }
});

// get movie detail by id
app.get("/details/:movieId", async (req, res) => {
  const movieId = parseInt(req.params.movieId);
  const movie = await prisma.movie.findUnique({
    where: {
      tmdbID: movieId,
    },include: {
      reviews: true,
    },
  });

  if (!movie) {
    return res.status(404).json({error: "Movie Not Found"});
  }

  res.json(movie);
})


// add new reviews
app.post("/details/review/:movieId", requireAuth, async (req, res) => {
  const movieId = parseInt(req.params.movieId);
  const auth0Id = req.auth.payload.sub;
  const {rating, comment} = req.body;

  if (rating >= 10 || rating < 0){
    return res.status(404).json({ error: "Rating should be in the range of 0 and 10" });
  }
  const newReview = await prisma.review.create({
    data: {
      userId: auth0Id, 
      rating, comment, movieId
    }, include: {
      user: true,
      movie: true,
    }
  });

  // Update userReviews in the User table
  await prisma.user.update({
    where: { auth0Id },
    data: {
      userReviews: {
        connect: { id: newReview.id },
      },
    },
  });

  // calculate new ratings
  const existingMovie = await prisma.movie.findUnique({
    where: { tmdbID: movieId },
    select: { rating: true, ratingCount: true },
  });

  const newRatingCount = existingMovie.ratingCount + 1;
  const newRating = ((existingMovie.rating * existingMovie.ratingCount + rating) / newRatingCount).toFixed(2);

  // Update reviews in the Movie table
  await prisma.movie.update({
    where: { tmdbID: movieId },
    data: {
      reviews: {
        connect: { id: newReview.id },
      },
      ratingCount: newRatingCount,
      rating: newRating,
    },
  });


  res.json(newReview); 
})


// update a review by movie id and userid
app.put("/details/review/:movieId", requireAuth, async (req, res) => {
  const movieId = parseInt(req.params.movieId);
  const auth0Id = req.auth.payload.sub;
  const {rating, comment} = req.body;

  const existingReview = await prisma.review.findFirst({
    where: {
      movieId: movieId,
      userId: auth0Id
    }
  });

  if (!existingReview) {
    return res.status(404).json({ error: "Review not found" });
  }

  // calculate new ratings
  const existingMovie = await prisma.movie.findUnique({
    where: { tmdbID: movieId },
    select: { rating: true, ratingCount: true },
  });

  const newRating = ((existingMovie.rating * existingMovie.ratingCount + rating - existingReview.rating) / existingMovie.ratingCount).toFixed(2);

  // Update the existing review
  const updatedReview = await prisma.review.update({
    where: {
      id: existingReview.id
    },
    data: {
      rating: rating,
      comment: comment
    }
  });

  // Update reviews in the Movie table
  await prisma.movie.update({
    where: { tmdbID: movieId },
    data: {
      rating: newRating,
    },
  });

  res.json(updatedReview);
})

// get a review by review id
app.get("/details/review/:reviewId", async (req, res) => {
  const reviewId = parseInt(req.params.reviewId);
  const review = await prisma.review.findUnique({
    where: {
      id: reviewId,
    }
  });

  if (!review) {
    return res.status(404).json({error: "Review Not Found"});
  }

  res.json(review);
})

// get all the reviews of a movie
app.get("/details/reviewByMovie/:movieId", async (req, res) => {
  const movieId = parseInt(req.params.movieId);
  
  const movie = await prisma.movie.findUnique({
    where: {
      tmdbID: movieId,
    }, include: {
      reviews: true,
    }
  });

  const reviews = movie.reviews;

  res.json(reviews);
})

// get all the reviews of an user
app.get("/details/reviewByUser/:userId", requireAuth, async (req, res) => {
  const userId = req.params.userId;
  
  const user = await prisma.user.findUnique({
    where: {
      auth0Id: userId,
    }, include: {
      userReviews: true,
    }
  });

  const reviews = user.userReviews;

  res.json(reviews);
})

// add new watched movies
app.put("/details/watched/:movieId", requireAuth, async (req, res) => {
  const movieId = parseInt(req.params.movieId);
  const auth0Id = req.auth.payload.sub;

  const user = await prisma.user.update({
    where: {
      auth0Id
    }, data: {
      watchedMovies: {connect: {tmdbID: movieId}}
    },
  });

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  res.json(user);
})

// add a new movie to the watchlist
app.put("/details/watchlist/:movieId", requireAuth, async (req, res) => {
  const movieId = parseInt(req.params.movieId);
  const auth0Id = req.auth.payload.sub;

  const user = await prisma.user.update({
    where: {
      auth0Id
    }, data: {
      watchList: {connect: {tmdbID: movieId}}
    },
  });

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  res.json(user);
})

// remove a movie from the watchlist
app.put("/details/watchlist/remove/:movieId", requireAuth, async(req, res) => {
  const movieId = parseInt(req.params.movieId);
  const auth0Id = req.auth.payload.sub;

  const user = await prisma.user.update({
    where: {
      auth0Id
    }, data: {
      watchList: {disconnect: {tmdbID: movieId}}
    },
  });

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  res.json(user);
})

// check if the user has added the current movie to their watchlist
app.get("/details/watchlist/:movieId", requireAuth, async (req, res) => {
  const movieId = parseInt(req.params.movieId);
  const auth0Id = req.auth.payload.sub;

  const user = await prisma.user.findUnique({
    where: {
      auth0Id,
    }, select: {
      watchList: { where: { tmdbID: movieId } }
    }
  });

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }
  return res.json(user.watchList);
})


//get user watched movies
app.get("/watchedMovies", requireAuth, async (req, res) => {
  const auth0Id = req.auth.payload.sub;

  const user = await prisma.user.findUnique({
    where: {
      auth0Id,
    },include: {
      watchedMovies: true,
    },
  });

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  const watchedMovies = user.watchedMovies;
  res.json(watchedMovies);
});

//get user watchlist movies
app.get("/watchList", requireAuth, async (req, res) => {
  const auth0Id = req.auth.payload.sub;

  const user = await prisma.user.findUnique({
    where: {
      auth0Id,
    },include: {
      watchList: true,
    },
  });

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  const watchList = user.watchList;
  console.log(watchList);
  res.json(watchList);
});



app.listen(8000, () => {
  console.log("Server running on http://localhost:8000 🎉 🚀");
});



