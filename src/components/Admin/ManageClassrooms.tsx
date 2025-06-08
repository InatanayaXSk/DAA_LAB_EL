import React, { useState } from 'react';
import { Building2, Plus, X, Calendar } from 'lucide-react';
import { useData } from '../../context/DataContext';

const ManageClassrooms: React.FC = () => {
  const { classrooms, addClassroom, updateClassroom } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    type: 'room' as 'room' | 'seminar_hall',
    capacity: 30,
    benches: 15,
    benchCapacity: 2,
    rows: 10,
    columns: 10,
    seatsPerRow: 10,
    examDate: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const classroomData = {
      name: formData.name,
      type: formData.type,
      capacity: formData.capacity,
      available: true,
      examDate: formData.examDate,
      ...(formData.type === 'room' ? {
        benches: formData.benches,
        benchCapacity: formData.benchCapacity
      } : {
        rows: formData.rows,
        columns: formData.columns,
        seatsPerRow: formData.seatsPerRow
      })
    };

    addClassroom(classroomData);
    setIsModalOpen(false);
    setFormData({
      name: '',
      type: 'room',
      capacity: 30,
      benches: 15,
      benchCapacity: 2,
      rows: 10,
      columns: 10,
      seatsPerRow: 10,
      examDate: ''
    });
  };

  const toggleAvailability = (id: string, available: boolean) => {
    updateClassroom(id, { available: !available });
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manage Classrooms</h1>
          <p className="text-gray-600 mt-1">Add and manage classroom availability</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Classroom
        </button>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Add New Classroom</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Classroom Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Room 101"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as 'room' | 'seminar_hall' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="room">Room</option>
                  <option value="seminar_hall">Seminar Hall</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Total Capacity
                </label>
                <input
                  type="number"
                  value={formData.capacity}
                  onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="1"
                  required
                />
              </div>

              {formData.type === 'room' ? (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Number of Benches
                    </label>
                    <input
                      type="number"
                      value={formData.benches}
                      onChange={(e) => setFormData({ ...formData, benches: parseInt(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      min="1"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Bench Capacity
                    </label>
                    <input
                      type="number"
                      value={formData.benchCapacity}
                      onChange={(e) => setFormData({ ...formData, benchCapacity: parseInt(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      min="1"
                      max="4"
                      required
                    />
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Rows
                    </label>
                    <input
                      type="number"
                      value={formData.rows}
                      onChange={(e) => setFormData({ ...formData, rows: parseInt(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      min="1"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Columns
                    </label>
                    <input
                      type="number"
                      value={formData.columns}
                      onChange={(e) => setFormData({ ...formData, columns: parseInt(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      min="1"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Seats/Row
                    </label>
                    <input
                      type="number"
                      value={formData.seatsPerRow}
                      onChange={(e) => setFormData({ ...formData, seatsPerRow: parseInt(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      min="1"
                      required
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Available for Exam Date (Optional)
                </label>
                <input
                  type="date"
                  value={formData.examDate}
                  onChange={(e) => setFormData({ ...formData, examDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Add Classroom
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Classroom Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {classrooms.map((classroom) => (
          <div key={classroom.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{classroom.name}</h3>
                  <p className="text-sm text-gray-600 capitalize">{classroom.type.replace('_', ' ')}</p>
                </div>
              </div>
              <button
                onClick={() => toggleAvailability(classroom.id, classroom.available)}
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  classroom.available
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                {classroom.available ? 'Available' : 'Occupied'}
              </button>
            </div>

            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>Capacity:</span>
                <span className="font-medium">{classroom.capacity} students</span>
              </div>
              
              {classroom.type === 'room' ? (
                <>
                  <div className="flex justify-between">
                    <span>Benches:</span>
                    <span className="font-medium">{classroom.benches}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Bench Capacity:</span>
                    <span className="font-medium">{classroom.benchCapacity} students</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex justify-between">
                    <span>Layout:</span>
                    <span className="font-medium">{classroom.rows} × {classroom.columns}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Seats per Row:</span>
                    <span className="font-medium">{classroom.seatsPerRow}</span>
                  </div>
                </>
              )}

              {classroom.examDate && (
                <div className="flex items-center gap-2 pt-2 border-t border-gray-200">
                  <Calendar className="w-4 h-4" />
                  <span>Reserved: {new Date(classroom.examDate).toLocaleDateString()}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageClassrooms;