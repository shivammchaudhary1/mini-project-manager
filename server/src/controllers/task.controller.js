import Task from "../models/task.model.js";
import Project from "../models/project.model.js";

const createTask = async (req, res) => {
  try {
    const { title, description, dueDate, projectId, status } = req.body;

    // Verify the project exists and belongs to the user
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    // Check if user owns the project
    if (project.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: "Not authorized to create tasks in this project",
      });
    }

    // Create new task
    const newTask = new Task({
      title,
      description,
      dueDate,
      status: status || "todo",
      project: projectId,
    });

    await newTask.save();

    res.status(201).json({
      success: true,
      message: "Task created successfully",
      task: newTask,
    });
  } catch (error) {
    console.error("Error creating task:", error);
    res.status(500).json({
      success: false,
      message: "Error creating task",
    });
  }
};

 const getTasksByProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { status, dueDate, sortBy, sortOrder } = req.query;

    // Verify the project exists and belongs to the user
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    // Check if user owns the project
    if (project.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: "Not authorized to access tasks in this project",
      });
    }

    // Build query
    let query = { project: projectId };

    // Filter by status if provided
    if (status) {
      query.status = status;
    }

    // Filter by due date if provided
    if (dueDate) {
      const startOfDay = new Date(dueDate);
      startOfDay.setHours(0, 0, 0, 0);

      const endOfDay = new Date(dueDate);
      endOfDay.setHours(23, 59, 59, 999);

      query.dueDate = { $gte: startOfDay, $lte: endOfDay };
    }

    // Build sort options
    let sort = {};
    if (sortBy) {
      sort[sortBy] = sortOrder === "desc" ? -1 : 1;
    } else {
      // Default sort by createdAt in descending order
      sort.createdAt = -1;
    }

    const tasks = await Task.find(query).sort(sort);

    res.status(200).json({
      success: true,
      count: tasks.length,
      tasks,
    });
  } catch (error) {
    console.error("Error fetching tasks:", error);

    // Check if error is due to invalid ID format
    if (error.kind === "ObjectId") {
      return res.status(400).json({
        success: false,
        message: "Invalid project ID format",
      });
    }

    res.status(500).json({
      success: false,
      message: "Error fetching tasks",
    });
  }
};

const getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id).populate("project");

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    // Check if user owns the project this task belongs to
    if (task.project.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: "Not authorized to access this task",
      });
    }

    res.status(200).json({
      success: true,
      task,
    });
  } catch (error) {
    console.error("Error fetching task:", error);

    // Check if error is due to invalid ID format
    if (error.kind === "ObjectId") {
      return res.status(400).json({
        success: false,
        message: "Invalid task ID format",
      });
    }

    res.status(500).json({
      success: false,
      message: "Error fetching task",
    });
  }
};

const updateTask = async (req, res) => {
  try {
    const { title, description, status, dueDate, projectId } = req.body;

    // Find the task
    const task = await Task.findById(req.params.id).populate("project");

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    // Check if user owns the project this task belongs to
    if (task.project.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: "Not authorized to update this task",
      });
    }

    // If projectId is changing, verify the new project belongs to the user
    if (projectId && projectId !== task.project._id.toString()) {
      const project = await Project.findById(projectId);
      if (!project) {
        return res.status(404).json({
          success: false,
          message: "Project not found",
        });
      }

      if (project.user.toString() !== req.user.id) {
        return res.status(401).json({
          success: false,
          message: "Not authorized to move task to this project",
        });
      }
    }

    // Update task
    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      {
        title,
        description,
        status,
        dueDate,
        project: projectId || task.project._id,
      },
      { new: true } // Return updated task
    );

    res.status(200).json({
      success: true,
      message: "Task updated successfully",
      task: updatedTask,
    });
  } catch (error) {
    console.error("Error updating task:", error);

    // Check if error is due to invalid ID format
    if (error.kind === "ObjectId") {
      return res.status(400).json({
        success: false,
        message: "Invalid task ID format",
      });
    }

    res.status(500).json({
      success: false,
      message: "Error updating task",
    });
  }
};

const updateTaskStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!status || !["todo", "in-progress", "done"].includes(status)) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid status value. Must be 'todo', 'in-progress', or 'done'",
      });
    }

    // Find the task
    const task = await Task.findById(req.params.id).populate("project");

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    // Check if user owns the project this task belongs to
    if (task.project.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: "Not authorized to update this task",
      });
    }

    // Update task status
    task.status = status;
    await task.save();

    res.status(200).json({
      success: true,
      message: "Task status updated successfully",
      task,
    });
  } catch (error) {
    console.error("Error updating task status:", error);

    // Check if error is due to invalid ID format
    if (error.kind === "ObjectId") {
      return res.status(400).json({
        success: false,
        message: "Invalid task ID format",
      });
    }

    res.status(500).json({
      success: false,
      message: "Error updating task status",
    });
  }
};

const deleteTask = async (req, res) => {
  try {
    // Find the task
    const task = await Task.findById(req.params.id).populate("project");

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    // Check if user owns the project this task belongs to
    if (task.project.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: "Not authorized to delete this task",
      });
    }

    // Delete task
    await Task.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Task deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting task:", error);

    // Check if error is due to invalid ID format
    if (error.kind === "ObjectId") {
      return res.status(400).json({
        success: false,
        message: "Invalid task ID format",
      });
    }

    res.status(500).json({
      success: false,
      message: "Error deleting task",
    });
  }
};

export {
  createTask,
  getTasksByProject,
  getTaskById,
  updateTask,
  updateTaskStatus,
  deleteTask,
};
