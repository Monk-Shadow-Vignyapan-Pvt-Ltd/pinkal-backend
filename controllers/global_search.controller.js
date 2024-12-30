import mongoose from "mongoose";
import { stripHtml } from "string-strip-html";

export const globalSearch = async (req, res) => {
    try {
      const { query } = req.query;
  
      if (!query) {
        return res.status(400).json({ msg: "Search query is required." });
      }
  
      const searchRegex = new RegExp(query, "i"); // Case-insensitive search
  
      // Define the collections, their searchable fields, and fields to include in the result
      const collectionsToSearch = {
        services: {
          searchableFields: ["serviceName", "serviceDescription", "whyChoose", "howWorks", "others"],
          resultFields: ["_id", "serviceName", "serviceDescription", "whyChoose", "howWorks", "others"],
        },
        subservices: {
          searchableFields: ["subServiceName", "subServiceDescription","howWorks","others"],
          resultFields: ["_id", "subServiceName", "subServiceDescription","howWorks","others"],
        },
        blogs: {
            searchableFields: ["blogTitle", "blogDescription","blog"],
            resultFields: ["_id", "blogTitle", "blogDescription","blog",],
          },
        faqs: {
            searchableFields: ["question", "answer",],
            resultFields: ["_id", "question", "answer",],
          },
        categories: {
            searchableFields: ["categoryName", "categoryDescription",],
            resultFields: ["_id", "categoryName", "categoryDescription",],
          },

      };
  
      const searchResults = {};
  
      // Loop through each collection and search
      for (const [collectionName, { searchableFields, resultFields }] of Object.entries(collectionsToSearch)) {
        const collection = mongoose.connection.collection(collectionName);
  
        const searchConditions = searchableFields.map((field) => {
          if (field === "whyChoose") {
            return {
              $or: [
                { "whyChoose.title": searchRegex },
                { "whyChoose.description": searchRegex },
                { "whyChoose": { $regex: searchRegex } },
              ],
            };
          }
  
          if (field === "others") {
            return {
              $or: [
                { "others.sectionName": searchRegex },
                { "others.content": { $regex: searchRegex } }, // Search the content field
                { "others.points.description": searchRegex }, // Search inside points.description
                { "others.points.title": searchRegex }, // Search inside points.description
              ],
            };
          }
  
          return { [field]: searchRegex };
        });
  
        // Create a projection object to include only the desired fields
        const projection = resultFields.reduce((acc, field) => {
          acc[field] = 1; // Include these fields
          return acc;
        }, {});
  
        const results = await collection
          .find({ $or: searchConditions }, { projection })
          .toArray();
  
        // Sanitize the results: strip HTML from string fields like 'whyChoose' and 'howWorks'
        results.forEach((doc) => {
          if (typeof doc.whyChoose === "string") {
            doc.whyChoose = stripHtml(doc.whyChoose).result; // Clean HTML content
          }
          if (typeof doc.howWorks === "string") {
            doc.howWorks = stripHtml(doc.howWorks).result; // Clean HTML content
          }
          if (typeof doc.blog === "string") {
            doc.blog = stripHtml(doc.blog).result; // Clean HTML content
          }
          // Sanitize 'others' field: if it's an array, strip HTML from content and points.description
          if (Array.isArray(doc.others)) {
            doc.others = doc.others.map((item) => {
              // Sanitize content and points.description fields
              if (typeof item.content === "string") {
                item.content = stripHtml(item.content).result;
              }
              if (Array.isArray(item.points)) {
                item.points = item.points.map((point) => {
                  if (typeof point.description === "string") {
                    point.description = stripHtml(point.description).result;
                  }
                  return point;
                });
              }
              return item;
            });
          }
        });
  
        searchResults[collectionName] = results;
      }
  
      res.status(200).json({
        success: true,
        query,
        results: searchResults,
      });
    } catch (error) {
      console.error("Search error:", error);
      res.status(500).json({
        success: false,
        msg: "Failed to perform global search.",
        error: error.message,
      });
    }
  };