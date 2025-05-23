import React from "react";
import { Check, X, User } from "lucide-react";

interface StudentData {
  id: string;
  name: string;
  photo: string;
  department: string;
  authorized: boolean;
  entryTime?: string;
}

interface StudentResultProps {
  student: StudentData;
}

const StudentResult: React.FC<StudentResultProps> = ({ student }) => {
  return (
    <div className={`rounded-lg overflow-hidden transition-all duration-300 ${
      student.authorized 
        ? "bg-green-50 border border-green-200" 
        : "bg-red-50 border border-red-200"
    }`}>
      <div className={`p-3 flex items-center ${
        student.authorized ? "bg-green-500" : "bg-red-500"
      } text-white`}>
        {student.authorized ? (
          <Check className="h-5 w-5 mr-2" />
        ) : (
          <X className="h-5 w-5 mr-2" />
        )}
        <span className="font-medium">
          {student.authorized 
            ? "Accès autorisé à l'examen" 
            : "Vous n'avez pas le droit de passer cet examen"}
        </span>
      </div>

      <div className="p-4">
        <div className="flex">
          <div className="mr-4 flex-shrink-0">
            {student.photo ? (
              <img 
                src={student.photo} 
                alt={student.name} 
                className="h-20 w-20 rounded-lg object-cover border-2 border-gray-200" 
              />
            ) : (
              <div className="h-20 w-20 bg-gray-200 rounded-lg flex items-center justify-center">
                <User className="h-10 w-10 text-gray-500" />
              </div>
            )}
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-800">{student.name}</h3>
            <div className="mt-1 text-sm text-gray-600">
              <p>ID: {student.id}</p>
              <p>Filière: {student.department}</p>
              {student.entryTime && (
                <p>Heure d'entrée: {student.entryTime}</p>
              )}
            </div>
          </div>
        </div>

        {!student.authorized && (
          <div className="mt-3 text-sm text-red-600">
            <p>⚠️ Une alerte a été envoyée à l'administrateur</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentResult;