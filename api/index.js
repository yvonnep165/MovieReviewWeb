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



