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
  origin: "*", // Specify the frontend's origin
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  allowedHeaders: ["Origin", "X-Requested-With", "Content-Type", "Accept", "Authorization", "x-auth-token"],
  credentials: true, // Allow credentials if needed
}));

// Explicitly handle OPTIONS method for preflight
app.options("*", cors()); // Allow preflight requests

// api's route
app.use("/api/v1/auth", routes.authRoute);
app.use("/api/v1/categories", routes.categoryRoute);
app.use("/api/v1/banners", routes.bannerRoute);
app.use("/api/v1/services", routes.serviceRoute);
app.use("/api/v1/testimonials", routes.testimonialRoute);
app.use("/api/v1/faqs", routes.faqRoute);
app.use("/api/v1/blogs", routes.blogRoute);
app.use("/api/v1/contacts", routes.contactRoute);
app.use("/api/v1/subServices", routes.subServiceRoute);
app.use("/api/v1/followups", routes.contactFollowupRoute);
app.use("/api/v1/surveys", routes.surveyRoute);
app.use("/api/v1/survey-answers", routes.surveyAnswerRoute);
app.use("/api/v1/statuses", routes.statusRoute);
app.use("/api/v1/seos", routes.seoRoute);

app.listen(PORT, () => {
    console.log(`server running at port ${PORT}`);
});
