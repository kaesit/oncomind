// src/services/patientService.ts

const API_URL = "http://localhost:5001/api";

export interface AnalysisDto {
     id: string;
     analysisType: string;
     timestamp: string;
     resultData: any;
}

// Ensure this matches your C# Patient class exactly (camelCase)
export interface PatientDto {
     id: string;
     firstName: string;
     lastName: string;
     age: number;
     gender: string; // The API sends "Male", "Female", or "0"/"1" as strings sometimes
     emergencyStatus: string;
     isAdmitted: boolean; // 👈 This fixes the "does not exist" error
     admissionLocation: string;
     treatmentStartAt?: string;
     profilePicture: string;
     analysisIds?: string[];
     examinations?: AnalysisDto[]; // For the detail view
}

export const patientService = {
     getAll: async (): Promise<PatientDto[]> => {
          const response = await fetch(`${API_URL}/Patient`);
          return await response.json();
     },
     // Use this for the Detail Page to get History
     getById: async (id: string): Promise<PatientDto> => {
          const response = await fetch(`${API_URL}/Patient/${id}`);
          if (!response.ok) throw new Error("Patient not found");
          return await response.json();
     }
};