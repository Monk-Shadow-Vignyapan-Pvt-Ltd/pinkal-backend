import { User } from '../models/user.model.js';
import jwt from "jsonwebtoken";
import bcryptjs from "bcryptjs";
import sharp from 'sharp';
import { Service } from '../models/service.model.js';
import { SubService } from '../models/sub_service.model.js';
import { Blog } from '../models/blog.model.js';
import { Seo } from '../models/seo.model.js';
import path from "path";
import fs from "fs";

// Signup Controller
export const addUser = async (req, res) => {
  try {
    const { email, password, username, avatar ,isAdmin,roles} = req.body;
    if (!email || !password || !username ) {
      return res.status(400).json({ msg: "Please enter all the fields" });
    }
    if (password.length < 6) {
      return res
        .status(400)
        .json({ msg: "Password should be at least 6 characters" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ msg: "User with the same email already exists" });
    }

    const hashedPassword = await bcryptjs.hash(password, 8);

    if (avatar && !avatar.startsWith('data:image')) {
        return res.status(400).json({ message: 'Invalid image data', success: false });
      }
      let compressedBase64 = "";
    if(avatar){
      const base64Data = avatar.split(';base64,').pop();
      const buffer = Buffer.from(base64Data, 'base64');

      // Resize and compress the image using sharp
      const compressedBuffer = await sharp(buffer)
          .resize(800, 600, { fit: 'inside' }) // Resize to 800x600 max, maintaining aspect ratio
          .jpeg({ quality: 80 }) // Convert to JPEG with 80% quality
          .toBuffer();

      // Convert back to Base64 for storage (optional)
       compressedBase64 = `data:image/jpeg;base64,${compressedBuffer.toString('base64')}`;
    }
      
    const newUser = new User({ email, password: hashedPassword, username, avatar:avatar ? compressedBase64 : avatar,isAdmin,roles });

    const savedUser = await newUser.save();
    res.json(savedUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Login Controller
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ msg: "Please enter all the fields" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .send({ msg: "User with this email does not exist" });
    }

    const isMatch = await bcryptjs.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).send({ msg: "Incorrect password." });
    }

    const token = jwt.sign({ id: user._id }, "passwordKey");
    res.json({ token, user: { id: user._id, username: user.username } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Token Validation Controller
export const tokenIsValid = async (req, res) => {
  try {
    const token = req.header("x-auth-token");
    if (!token) return res.json(false);

    const verified = jwt.verify(token, "passwordKey");
    if (!verified) return res.json(false);

    const user = await User.findById(verified.id);
    if (!user) return res.json(false);

    return res.json(true);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get User Info Controller
export const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.user);
    const users = await User.find();
    const filteredUsers = users.map(({ _id, email, username, avatar}) => ({
      _id,
      email,
      username,
      avatar
  }));
   
    res.json({
      username: user.username,
      id: user._id,
      avatar: user.avatar,
      roles:user.roles,
      users:filteredUsers
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getUsers = async (req, res) => {
    try {
        const users = await User.find();
        if (!users) return res.status(404).json({ message: "Users not found", success: false });
        return res.status(200).json({ users });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Failed to fetch users', success: false });
    }
};

export const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { email, password, username, avatar ,isAdmin,roles} = req.body;

        // Validate base64 image data if provided
        if (!email || !password || !username ) {
            return res.status(400).json({ msg: "Please enter all the fields" });
          }
          if (password.length < 6) {
            return res
              .status(400)
              .json({ msg: "Password should be at least 6 characters" });
          }
    
      
          const hashedPassword = await bcryptjs.hash(password, 8);
      
          if (avatar && !avatar.startsWith('data:image')) {
              return res.status(400).json({ message: 'Invalid image data', success: false });
            }
            let compressedBase64 = "";
            if(avatar){
              const base64Data = avatar.split(';base64,').pop();
              const buffer = Buffer.from(base64Data, 'base64');
        
              // Resize and compress the image using sharp
              const compressedBuffer = await sharp(buffer)
                  .resize(800, 600, { fit: 'inside' }) // Resize to 800x600 max, maintaining aspect ratio
                  .jpeg({ quality: 80 }) // Convert to JPEG with 80% quality
                  .toBuffer();
        
              // Convert back to Base64 for storage (optional)
               compressedBase64 = `data:image/jpeg;base64,${compressedBuffer.toString('base64')}`;
            }

        const updatedData = { email, password: hashedPassword, username, avatar:avatar ? compressedBase64 :avatar,isAdmin,roles };

        const user = await User.findByIdAndUpdate(id, updatedData, { new: true, runValidators: true });
        if (!user) return res.status(404).json({ message: "User not found!", success: false });
        return res.status(200).json({ user, success: true });
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: error.message, success: false });
    }
};

export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findByIdAndDelete(id);
        if (!user) return res.status(404).json({ message: "User not found!", success: false });
        return res.status(200).json({ user, success: true });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Failed to delete user', success: false });
    }
};

const getDynamicRoutes = async () => {
  try {
      // const [serviceResponse, subServiceResponse, blogResponse, seoResponse] = await Promise.all([
      //     axios.get(`${API_BASE_URL}/services/getServicesFrontend`),
      //     axios.get(`${API_BASE_URL}/subServices/getSubServicesFrontend`),
      //     axios.get(`${API_BASE_URL}/blogs/getBlogsFrontend`),
      //     axios.get(`${API_BASE_URL}/seos/getAllSeo`),
      // ]);
      const services = await Service.find().select('serviceUrl serviceEnabled');
      const subServices = await SubService.find().select('subServiceUrl subServiceEnabled');
      const blogs = await Blog.find().select('blogUrl');
      const seoEntries = await Seo.find();

      const enabledServices = services?.filter(service => service.serviceEnabled)
      const enabledSubServices = subServices?.filter(subService => subService.subServiceEnabled)


      const serviceRoutes = enabledServices?.map(service => `/service/${service.serviceUrl}`) || [];
      const subServiceRoutes = enabledSubServices?.map(subService => `/sub-service/${subService.subServiceUrl}`) || [];
      const blogRoutes = blogs?.map(blog => `/blog-detail/${blog.blogUrl}`) || [];
      const seoRoutes = seoEntries?.map(seo => `/${seo.seoUrl}`) || [];

      return [...serviceRoutes, ...subServiceRoutes, ...blogRoutes, ...seoRoutes];
  } catch (error) {
      console.error("Error fetching dynamic routes:", error);
      return [];
  }
};

export const generateSitemap = async (req = null, res = null) => {
  try {
    const dynamicRoutes = await getDynamicRoutes();

    const urls = [
      { url: "/", changefreq: "daily", priority: 1.0 },
      { url: "/privacy-policy", changefreq: "monthly", priority: 0.7 },
      ...dynamicRoutes.map(route => ({ url: route, changefreq: "weekly", priority: 0.8 })),
    ];

    // Generate XML Sitemap
    const sitemapContent = `
      <?xml version="1.0" encoding="UTF-8"?>
      <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        ${urls
          .map(
            ({ url, changefreq, priority }) => `
          <url>
            <loc>https://pinkalhealth.com${url}</loc>
            <changefreq>${changefreq}</changefreq>
            <priority>${priority}</priority>
          </url>`
          )
          .join("\n")}
      </urlset>
    `.trim();

    const sitemapPath = "../pinkal-frontend/dist/sitemap.xml" // Save in `public` folder
    fs.writeFileSync(sitemapPath, sitemapContent,'utf8');
    console.log(`Sitemap XML generated at: ${sitemapPath}`);

    // Generate HTML Sitemap
    const htmlContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>HTML Sitemap</title>
          <style>
              body { font-family: Arial, sans-serif; padding: 20px; }
              h1 { color: #333; }
              ul { list-style-type: none; padding: 0; }
              li { margin: 5px 0; }
              a { text-decoration: none; color: blue; }
          </style>
      </head>
      <body>
          <h1>HTML Sitemap</h1>
          <ul>
              ${dynamicRoutes
                .map(route => `<li><a href="https://pinkalhealth.com${route}">https://pinkalhealth.com${route}</a></li>`)
                .join("\n")}
          </ul>
      </body>
      </html>
    `.trim();

    const sitemapHTMLPath = "../pinkal-frontend/dist/sitemap.html"; // Save in `public` folder
    fs.writeFileSync(sitemapHTMLPath, htmlContent,'utf8');
    console.log(`Sitemap HTML generated at: ${sitemapHTMLPath}`);

    if (res) {
      return res.status(200).json({ message: "Sitemap generated successfully", success: true });
    }
  } catch (error) {
    console.error("Error generating sitemap:", error);
    res.status(500).json({ message: "Failed to generate sitemap", success: false });
  }
};

