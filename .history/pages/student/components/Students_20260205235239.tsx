"use client";

import React, { useEffect, useState } from "react";
import { FiPlus, FiEye, FiMessageCircle, FiX } from "react-icons/fi";
import { db } from "@/lib/firebase"; // Adjust path
import {
  collection,
  getDocs,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import toast from "react-hot-toast";

interface Student {
  id: string;
  name: string;
  room: string;
  checkIn: string;
  status: "Active" | "New" | "Leaving Soon" | string;
}

const Students: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal states
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // New student form state
  const [newStudent, setNewStudent] = useState({
    name: "",
    room: "",
    checkIn: "",
    status: "New",
  });

  // Fetch students
  const fetchStudents = async () => {
    try {
      setLoading(true);
      setError(null);
      const querySnapshot = await getDocs(collection(db, "students"));
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<Student, "id">),
      }));
      setStudents(data);
    } catch (err) {
      setError("Failed to load students");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // Handle Add student form input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setNewStudent({ ...newStudent, [e.target.name]: e.target.value });
  };

  // Add new student
  const handleAddStudent = async () => {
    const { name, room, checkIn } = newStudent;
    if (!name || !room || !checkIn) {
      toast.error("Please fill all fields");
      return;
    }
    try {
      await addDoc(collection(db, "students"), newStudent);
      toast.success("Student added successfully");
      setShowAddModal(false);
      setNewStudent({ name: "", room: "", checkIn: "", status: "New" });
      fetchStudents();
    } catch (err) {
      toast.error("Failed to add student");
      console.error(err);
    }
  };

  // View student modal open
  const handleView = (student: Student) => {
    setSelectedStudent(student);
    setShowViewModal(true);
  };

  // Close modals
  const closeModals = () => {
    setShowViewModal(false);
    setShowAddModal(false);
    setSelectedStudent(null);
  };

  if (loading) return <div>Loading students...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Student Management
          </h2>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-[#FF4FA1] text-white rounded-lg hover:bg-[#FF4FA1]/90 flex items-center gap-2"
          >
            <FiPlus />
            Add Student
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {[
            { label: "Total Students", count: students.length.toString(), color: "bg-[#00CFFF]" },
            {
              label: "New This Month",
              count: students.filter(s => new Date(s.checkIn) >= new Date(new Date().setDate(new Date().getDate() - 30))).length.toString(),
              color: "bg-[#FF4FA1]",
            },
            { label: "Graduating Soon", count: "12", color: "bg-yellow-500" }, // You can adjust this dynamically
          ].map((stat, idx) => (
            <div key={idx} className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{stat.count}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Student List */}
        <div className="space-y-4">
          {students.map((student) => (
            <div
              key={student.id}
              className="flex flex-col md:flex-row md:items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
            >
              <div className="mb-3 md:mb-0">
                <div className="flex items-center gap-3 mb-2">
                  <div className="text-lg font-medium text-gray-900 dark:text-white">{student.name}</div>
                  <div
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      student.status === "Active"
                        ? "bg-green-500/10 text-green-600"
                        : student.status === "New"
                        ? "bg-blue-500/10 text-blue-600"
                        : "bg-yellow-500/10 text-yellow-600"
                    }`}
                  >
                    {student.status}
                  </div>
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Room {student.room} • Check-in: {student.checkIn}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleView(student)}
                  className="px-3 py-1.5 bg-[#00CFFF] text-white rounded-lg text-sm hover:bg-[#00CFFF]/90 flex items-center gap-1"
                >
                  <FiEye />
                  View
                </button>
                <button
                  onClick={() => toast("Messaging feature coming soon!")}
                  className="px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm"
                >
                  <FiMessageCircle />
                  Message
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* View Student Modal */}
      {showViewModal && selectedStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full relative">
            <button
              onClick={closeModals}
              className="absolute top-3 right-3 text-gray-600 dark:text-gray-400 hover:text-red-500"
              aria-label="Close view modal"
            >
              <FiX size={20} />
            </button>
            <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Student Details</h3>
            <p><strong>Name:</strong> {selectedStudent.name}</p>
            <p><strong>Room:</strong> {selectedStudent.room}</p>
            <p><strong>Check-in Date:</strong> {selectedStudent.checkIn}</p>
            <p><strong>Status:</strong> {selectedStudent.status}</p>
          </div>
        </div>
      )}

      {/* Add Student Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full relative">
            <button
              onClick={closeModals}
              className="absolute top-3 right-3 text-gray-600 dark:text-gray-400 hover:text-red-500"
              aria-label="Close add modal"
            >
              <FiX size={20} />
            </button>
            <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Add New Student</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleAddStudent();
              }}
              className="space-y-4"
            >
              <input
                type="text"
                name="name"
                placeholder="Name"
                value={newStudent.name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                required
              />
              <input
                type="text"
                name="room"
                placeholder="Room Number"
                value={newStudent.room}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                required
              />
              <input
                type="date"
                name="checkIn"
                placeholder="Check-in Date"
                value={newStudent.checkIn}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                required
              />
              <select
                name="status"
                value={newStudent.status}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value="New">New</option>
                <option value="Active">Active</option>
                <option value="Leaving Soon">Leaving Soon</option>
              </select>

              <button
                type="submit"
                className="w-full bg-[#FF4FA1] text-white py-2 rounded-md hover:bg-[#FF4FA1]/90"
              >
                Add Student
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Students;