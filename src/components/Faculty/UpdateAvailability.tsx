import React, { useState } from 'react';
import { Calendar, Clock, Plus, X } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';

const UpdateAvailability: React.FC = () => {
  const { updateInvigilatorAvailability, invigilatorAvailability } = useData();
  const { user } = useAuth();
  const [availableDates, setAvailableDates] = useState<string[]>([]);
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('');

  const currentAvailability = invigilatorAvailability.find(a => a.facultyId === user?.id);

  React.useEffect(() => {
    if (currentAvailability) {
      setAvailableDates(currentAvailability.availableDates);
      setAvailableTimes(currentAvailability.availableTimes);
    }
  }, [currentAvailability]);

  const addDate = () => {
    if (newDate && !availableDates.includes(newDate)) {
      setAvailableDates([...availableDates, newDate]);
      setNewDate('');
    }
  };

  const removeDate = (date: string) => {
    setAvailableDates(availableDates.filter(d => d !== date));
  };

  const addTime = () => {
    if (newTime && !availableTimes.includes(newTime)) {
      setAvailableTimes([...availableTimes, newTime]);
      setNewTime('');
    }
  };

  const removeTime = (time: string) => {
    setAvailableTimes(availableTimes.filter(t => t !== time));
  };

  const saveAvailability = () => {
    if (user) {
      updateInvigilatorAvailability({
        facultyId: user.id,
        facultyName: user.name,
        availableDates,
        availableTimes
      });
      alert('Availability updated successfully!');
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Update Availability</h1>
        <p className="text-gray-600 mt-1">Set your availability for exam invigilation</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Available Dates */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Available Dates
          </h2>

          <div className="space-y-4">
            <div className="flex gap-2">
              <input
                type="date"
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={addDate}
                className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2">
              {availableDates.map((date, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                  <span className="text-green-800 font-medium">
                    {new Date(date).toLocaleDateString()}
                  </span>
                  <button
                    onClick={() => removeDate(date)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
              {availableDates.length === 0 && (
                <p className="text-gray-500 text-center py-4">No dates added yet</p>
              )}
            </div>
          </div>
        </div>

        {/* Available Times */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Available Times
          </h2>

          <div className="space-y-4">
            <div className="flex gap-2">
              <input
                type="time"
                value={newTime}
                onChange={(e) => setNewTime(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={addTime}
                className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2">
              {availableTimes.map((time, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <span className="text-blue-800 font-medium">{time}</span>
                  <button
                    onClick={() => removeTime(time)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
              {availableTimes.length === 0 && (
                <p className="text-gray-500 text-center py-4">No times added yet</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <button
          onClick={saveAvailability}
          className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
        >
          Save Availability
        </button>
      </div>
    </div>
  );
};

export default UpdateAvailability;