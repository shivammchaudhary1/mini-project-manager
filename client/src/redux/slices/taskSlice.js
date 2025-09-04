import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { taskService } from "../../services/api";

const initialState = {
  tasks: [],
  loading: false,
  statusFilter: "all",
  sortOrder: "asc",
};

// Fetch tasks for a project
export const fetchTasksByProject = createAsyncThunk(
  "tasks/fetchByProject",
  async (projectId, { rejectWithValue }) => {
    try {
      const data = await taskService.getByProject(projectId);

      if (data.success) {
        return data.tasks;
      } else {
        return rejectWithValue(data.message || "Failed to fetch tasks");
      }
    } catch (error) {
      return rejectWithValue(error.message || "Error fetching tasks");
    }
  }
);

// Create a new task
export const createTask = createAsyncThunk(
  "tasks/create",
  async (taskData, { rejectWithValue }) => {
    try {
      const data = await taskService.create(taskData);

      if (data.success) {
        return data.task;
      } else {
        return rejectWithValue(data.message || "Failed to create task");
      }
    } catch (error) {
      return rejectWithValue(error.message || "Error creating task");
    }
  }
);

// Update a task
export const updateTask = createAsyncThunk(
  "tasks/update",
  async ({ taskId, taskData }, { rejectWithValue }) => {
    try {
      const data = await taskService.update(taskId, taskData);

      if (data.success) {
        return data.task;
      } else {
        return rejectWithValue(data.message || "Failed to update task");
      }
    } catch (error) {
      return rejectWithValue(error.message || "Error updating task");
    }
  }
);

// Update task status
export const updateTaskStatus = createAsyncThunk(
  "tasks/updateStatus",
  async ({ taskId, status }, { rejectWithValue }) => {
    try {
      const data = await taskService.updateStatus(taskId, status);

      if (data.success) {
        return { taskId, status };
      } else {
        return rejectWithValue(data.message || "Failed to update task status");
      }
    } catch (error) {
      return rejectWithValue(error.message || "Error updating task status");
    }
  }
);

// Delete a task
export const deleteTask = createAsyncThunk(
  "tasks/delete",
  async (taskId, { rejectWithValue }) => {
    try {
      const data = await taskService.delete(taskId);

      if (data.success) {
        return taskId;
      } else {
        return rejectWithValue(data.message || "Failed to delete task");
      }
    } catch (error) {
      return rejectWithValue(error.message || "Error deleting task");
    }
  }
);

export const taskSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    setStatusFilter: (state, action) => {
      state.statusFilter = action.payload;
    },
    setSortOrder: (state, action) => {
      state.sortOrder = action.payload;
    },
    clearTasks: (state) => {
      state.tasks = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasksByProject.fulfilled, (state, action) => {
        state.tasks = action.payload;
        state.loading = false;
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.tasks.unshift(action.payload);
        state.loading = false;
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        const index = state.tasks.findIndex(
          (task) => task._id === action.payload._id
        );
        if (index !== -1) {
          state.tasks[index] = action.payload;
        }
        state.loading = false;
      })
      .addCase(updateTaskStatus.fulfilled, (state, action) => {
        const index = state.tasks.findIndex(
          (task) => task._id === action.payload.taskId
        );
        if (index !== -1) {
          state.tasks[index].status = action.payload.status;
        }
        state.loading = false;
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.tasks = state.tasks.filter((task) => task._id !== action.payload);
        state.loading = false;
      });
  },
});

export const { setStatusFilter, setSortOrder, clearTasks } = taskSlice.actions;
export default taskSlice.reducer;
