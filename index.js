import express, { urlencoded } from "express";
import connectDB from "./db/connection.js";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import bodyParser from "body-parser";
import routes from "./routes/index.js";

dotenv.config();
// connect db
connectDB();
const PORT = process.env.PORT || 8080;
const app = express();


// middleware
app.use(express.json({ limit: '50mb' }));
app.use(bodyParser.json({ limit: '50mb' }));  // Example for a 50MB limit
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(urlencoded({extended:true}));
app.use(cookieParser());

app.use(cors({
    origin: "*", // Allow all origins
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE", // Allow all HTTP methods
    allowedHeaders: "Origin, X-Requested-With, Content-Type, Accept, Authorization", // Specify allowed headers
}));

// const allowedOrigins = ['http://localhost:3000','http://localhost:5173','http://localhost:5174', 'http://127.0.0.1:3000', 'http://207.244.239.52']; // Add your server IP as needed

// app.use((req, res, next) => {
//   const origin = req.headers.origin;
//   if (allowedOrigins.includes(origin)) {
//     res.header("Access-Control-Allow-Origin", origin);
//   }
//   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//   next();
// });

// api's route
app.use("/api/v1/categories", routes.categoryRoute);
app.use("/api/v1/banners", routes.bannerRoute);
app.use("/api/v1/services", routes.serviceRoute);
app.use("/api/v1/testimonials", routes.testimonialRoute);
app.use("/api/v1/faqs", routes.faqRoute);
app.use("/api/v1/blogs", routes.blogRoute);
app.use("/api/v1/contacts", routes.contactRoute);
app.use("/api/v1/subServices", routes.subServiceRoute);
app.use("/api/v1/followups", routes.contactFollowupRoute);

app.listen(PORT, () => {
    console.log(`server running at port ${PORT}`);
});
