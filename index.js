const express = require("express")
const axios = require("axios")
const redis = require('redis')

const app = express();
const redisClient = redis.createClient()
redisClient.on("error", (err) => console.log("Redis Client Error", err));

const DEFAULT_EXPIRATION = 3600


app.get("/", (req, res) => {
  res.send("I love Redis!");
});

// app.get("/photos", async (req, res) => {
//   const albumId = req.query.albumId;
//   const data = await axios.get("https://jsonplaceholder.typicode.com/photos", {
//     params: {
//       albumId,
//     },
//   });
//   res.json(data.data);
// });

// app.get("/photos", async (req, res) => {
//   const albumId = req.query.albumId;

//   const value = await redisClient.get("photos")
//   console.log(value)
//   if(value) {
//     console.log("Cache hit !")
//     res.json(JSON.parse(value))
//   } else {
//     console.log("Cache miss !")
//     const data = await axios.get("https://jsonplaceholder.typicode.com/photos", {
//       params: {
//         albumId,
//       },
//     });

//     redisClient.setEx("photos", DEFAULT_EXPIRATION, JSON.stringify(data.data))
//     res.json(data.data);
//   }
// });

// app.get("/photos", async (req, res) => {
//   const albumId = req.query.albumId;

//   const value = await redisClient.get("photos")
//   if(value) {
//     console.log("Cache hit !")
//     res.json(JSON.parse(value))
//   } else {
//     console.log("Cache miss !")
//     const data = await axios.get("https://jsonplaceholder.typicode.com/photos", {
//       params: {
//         albumId,
//       },
//     });

//     redisClient.setEx("photos", DEFAULT_EXPIRATION, JSON.stringify(data.data))
//     res.json(data.data);
//   }
// });

// app.get("/photos", async (req, res) => {
//   const albumId = req.query.albumId;

//   redisClient.get("photos", async (error, catchData) => {
//     if (error) {
//       console.error(error);
//       res.status(500).json({ error: "Internal Server Error" });
//     }

//     if(catchData) {
//       console.log("Cache hit !")
//       res.json(JSON.parse(catchData))
//     } else {
//       console.log("Cache miss !")
//       try {
//         const { data } = await axios.get("https://jsonplaceholder.typicode.com/photos", {
//           params: {
//             albumId,
//           },
//         });

//         redisClient.setEx("photos", DEFAULT_EXPIRATION, JSON.stringify(data));
//         res.json(data);
//       } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: "Internal Server Error" });
//       }
//     }
//   })
  
// });



// app.get("/photos", async (req, res) => {
//   const albumId = req.query.albumId;

//   redisClient.get("photos", async (error, cachedData) => {
//     if (error) {
//       console.error(error);
//       return res.status(500).json({ error: "Internal Server Error" });
//     }

//     if (cachedData) {
//       console.log("Cache hit !");
//       return res.json(JSON.parse(cachedData));
//     }

//     console.log("Cache miss !");
//     try {
//       const { data } = await axios.get("https://jsonplaceholder.typicode.com/photos", {
//         params: { albumId },
//       });

//       redisClient.setEx("photos", DEFAULT_EXPIRATION, JSON.stringify(data));
//       res.json(data);
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ error: "Internal Server Error", message: error.message });
//     }
//   });
// });

// app.get("/photos", async (req, res) => {
//   const albumId = req.query.albumId;

//   // Check the cache
//   const value = await redisClient.get("photos");
//   if (value) {
//     console.log("Cache hit!");
//     res.json(JSON.parse(value));
//   } else {
//     console.log("Cache miss!");
//     const data = await axios.get(
//       "https://jsonplaceholder.typicode.com/photos",
//       {
//         params: {
//           albumId,
//         },
//       }
//     );
//     client.setEx("photos", DEFAULT_EXPIRATION, JSON.stringify(data.data));
//     res.json(data.data);
//   }
// });

app.get("/photos", async (req, res) => {
  const albumId = req.query.albumId;

  // Check the cache
  const value = await redisClient.get(`photos?albumId=${albumId}`);
  if (value) {
    console.log("Cache hit!");
    res.json(JSON.parse(value));
  } else {
    console.log("Cache miss!");
    const data = await axios.get(
      "https://jsonplaceholder.typicode.com/photos",
      {
        params: {
          albumId,
        },
      }
    );
    redisClient.setEx(
      `photos?albumId=${albumId}`,
      DEFAULT_EXPIRATION,
      JSON.stringify(data.data)
    );
    res.json(data.data);
  }
});


app.listen(3000, () => {
  async function redisConnect() {
    try {
      await redisClient.connect()
      console.log("Connected to Redis");
    } catch (error) {
      console.log("Error connect to Redis");
    }
  }
  redisConnect()
  console.log("Listening on port 3000")
});