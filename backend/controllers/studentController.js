import { Student } from "../models/studentSchema.js";

// Create a new student
export const createStudent = async (req, res, next) => {

  const { name, registrationNumber, grade, age, gender, email, profileImage } =
    req.body;

  try {
    if (!name || !registrationNumber || !grade || !age || !gender || !email) {
      return res
        .status(400)
        .json({ success: false, message: "Please fill all fields" });
    }

    const student = new Student({
      name,
      registrationNumber,
      grade,
      age,
      gender,
      email,
      profileImage,
    });

    await student.save(); // Ensuring save() is used
    console.log("Student created successfully:", student);

    res.status(201).json({
      success: true,
      message: "Student created successfully",
      student, // Return created student
    });
  } catch (err) {
    console.error("Error creating student:", err);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: err.message,
    });
  }
};

// Get all students
export const getAllStudents = async (req, res, next) => {
  try {
    const students = await Student.find();
    res.status(200).json({
      success: true,
      students,
    });
  } catch (err) {
    console.error("Error fetching students:", err);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: err.message,
    });
  }
};

export const updateStudent = async (req, res, next) => {
  const { id } = req.params;
  const updates = req.body;

  try {
    const student = await Student.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      student,
    });
  } catch (err) {
    console.error("Error updating student:", err);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: err.message,
    });
  }
};

export const getStudentByEmail = async (req, res) => {
  try {
    const { email } = req.params; // Get email from URL params

    // Find student by email
    const student = await Student.findOne({ email })

    // If no student found
    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found with this email",
      });
    }

    // Return student data
    res.status(200).json({
      success: true,
      message: "Student information retrieved successfully",
      student,
    });

  } catch (error) {
    console.error("Error in getStudentByEmail:", error);
    res.status(500).json({
      success: false,
      message: "Error retrieving student information",
      error: error.message,
    });
  }
};
