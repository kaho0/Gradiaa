import Submission from "../models/submissionSchema.js";
import Assignment from "../models/assignmentSchema.js";
import multer from "multer";
import path from "path";
import fs from 'fs';

// Ensure upload directory exists
const uploadDir = 'uploads/assignments';
if (!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir); // Use the uploadDir constant
  },
  filename: function (req, file, cb) {
    // Create unique filename with original extension
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// File filter function
const fileFilter = (req, file, cb) => {
  // Allow specific file types
  const allowedTypes = /pdf|doc|docx|txt|jpg|jpeg|png/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error('Only PDF, DOC, DOCX, TXT, JPG, JPEG, and PNG files are allowed!'));
  }
};

// Configure multer upload
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: fileFilter
}).single('submissionFile'); // 'submissionFile' is the field name in form data

// 📌 Submit an Assignment
export const submitAssignment = async (req, res) => {
  try {
    upload(req, res, async function(err) {
      // Handle multer errors
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({
            success: false,
            message: "File is too large. Maximum size is 5MB"
          });
        }
        return res.status(400).json({
          success: false,
          message: "File upload error",
          error: err.message
        });
      } else if (err) {
        return res.status(400).json({
          success: false,
          message: err.message
        });
      }

      try {
        const assignmentId = req.params.assignmentId;
        const { student, content, studentId } = req.body;

        // Validate required fields
        if (!student || !content || !studentId) {
          return res.status(400).json({
            success: false,
            message: "Student name, content and studentId are required"
          });
        }

        // Check if assignment exists
        const assignment = await Assignment.findById(assignmentId);
        if (!assignment) {
          return res.status(404).json({
            success: false,
            message: "Assignment not found"
          });
        }

        // Create submission object
        const submissionData = {
          assignmentId,
          student,
          content,
          studentId,
          status: "pending"
        };

        // Add file information if a file was uploaded
        if (req.file) {
          submissionData.fileUrl = `/uploads/assignments/${req.file.filename}`;
          submissionData.fileName = req.file.originalname;
        }

        // Create and save submission
        const submission = new Submission(submissionData);
        const savedSubmission = await submission.save();

        // Update assignment with submission reference
        await Assignment.findByIdAndUpdate(
          assignmentId,
          { $push: { submissions: savedSubmission._id } }
        );
        console.log("Submission saved:", savedSubmission);
        res.status(201).json({
          success: true,
          message: "Assignment submitted successfully",
          submission: savedSubmission
        });

      } catch (error) {
        console.error("Submission error:", error);
        res.status(500).json({
          success: false,
          message: "Error processing submission",
          error: error.message
        });
      }
    });
  } catch (error) {
    console.error("Controller error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};

// 📌 Get Submissions by Assignment
export const getSubmissionsByAssignment = async (req, res) => {
  try {
    const { assignmentId } = req.params;

    if (!assignmentId) {
      return res
        .status(400)
        .json({ success: false, message: "Assignment ID is required" });
    }

    const submissions = await Submission.find({ assignmentId }).populate(
      "studentId",
      "name email"
    );

    res.status(200).json({ success: true, submissions });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching submissions",
      error,
    });
  }
};
export const getAllSubmissions = async (req, res) => {
  try {
    const submissions = await Submission.find();
    res.status(200).json({ success: true, submissions });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error fetching submissions", error });
  }
};

// 📌 Grade a Specific Submission
export const gradeSubmission = async (req, res) => {
  try {
    const { id } = req.params; // Submission ID from URL
    const { grade } = req.body; // Grade from the request body

    if (!grade) {
      return res
        .status(400)
        .json({ success: false, message: "Grade is required" });
    }

    // Ensure the submission exists
    const submission = await Submission.findById(id);
    if (!submission) {
      return res
        .status(404)
        .json({ success: false, message: "Submission not found" });
    }

    // Update the submission with the grade
    submission.grade = grade; // Set the grade in the submission
    await submission.save(); // Save the updated submission

    res.status(200).json({ success: true, submission });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error grading submission", error });
  }
};