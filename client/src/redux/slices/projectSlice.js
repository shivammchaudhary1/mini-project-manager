import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { projectService } from "../../services/api";

const initialState = {
  projects: [],
  currentProject: null,
  loading: false,
};

// Fetch all projects
export const fetchProjects = createAsyncThunk(
  "projects/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const data = await projectService.getAll();

      if (data.success) {
        return data.projects;
      } else {
        return rejectWithValue(data.message || "Failed to fetch projects");
      }
    } catch (error) {
      return rejectWithValue(error.message || "Error fetching projects");
    }
  }
);

// Fetch a single project by ID
export const fetchProjectById = createAsyncThunk(
  "projects/fetchById",
  async (projectId, { rejectWithValue }) => {
    try {
      const data = await projectService.getById(projectId);

      if (data.success) {
        return data.project;
      } else {
        return rejectWithValue(data.message || "Failed to fetch project");
      }
    } catch (error) {
      return rejectWithValue(error.message || "Error fetching project");
    }
  }
);

// Create a new project
export const createProject = createAsyncThunk(
  "projects/create",
  async (projectData, { rejectWithValue }) => {
    try {
      const data = await projectService.create(projectData);

      if (data.success) {
        return data.project;
      } else {
        return rejectWithValue(data.message || "Failed to create project");
      }
    } catch (error) {
      return rejectWithValue(error.message || "Error creating project");
    }
  }
);

// Delete a project
export const deleteProject = createAsyncThunk(
  "projects/delete",
  async (projectId, { rejectWithValue }) => {
    try {
      const data = await projectService.delete(projectId);

      if (data.success) {
        return projectId; // Return the ID of the deleted project
      } else {
        return rejectWithValue(data.message || "Failed to delete project");
      }
    } catch (error) {
      return rejectWithValue(error.message || "Error deleting project");
    }
  }
);

export const projectSlice = createSlice({
  name: "projects",
  initialState,
  reducers: {
    sortProjects: (state, action) => {
      const { sortOrder } = action.payload;
      if (sortOrder === "newest") {
        state.projects.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
      } else {
        state.projects.sort(
          (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
        );
      }
    },
    clearCurrentProject: (state) => {
      state.currentProject = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.projects = action.payload;
        state.loading = false;
      })
      .addCase(fetchProjectById.fulfilled, (state, action) => {
        state.currentProject = action.payload;
        state.loading = false;
      })
      .addCase(createProject.fulfilled, (state, action) => {
        state.projects.unshift(action.payload);
        state.loading = false;
      })
      .addCase(deleteProject.fulfilled, (state, action) => {
        state.projects = state.projects.filter(
          (project) => project._id !== action.payload
        );
        state.loading = false;
      });
  },
});

export const { sortProjects, clearCurrentProject } = projectSlice.actions;
export default projectSlice.reducer;
