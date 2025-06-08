import React, { useState } from 'react';
import { Users, Building2, Upload, Download, ArrowRight, FileText } from 'lucide-react';
import { useData } from '../../context/DataContext';

interface CSVStudent {
  name: string;
  rollNumber: string;
  year: number;
  section: string;
}

const SeatingArrangements: React.FC = () => {
  const { exams, classrooms, addSeatingArrangement } = useData();
  const [selectedExam, setSelectedExam] = useState<string>('');
  const [selectedClassroom, setSelectedClassroom] = useState<string>('');
  const [csvStudents, setCsvStudents] = useState<CSVStudent[]>([]);
  const [roomConfig, setRoomConfig] = useState({
    numberOfStudents: 0,
    numberOfBenches: 0,
    studentsPerBench: 2
  });
  const [hallConfig, setHallConfig] = useState({
    numberOfStudents: 0,
    numberOfRows: 0,
    numberOfColumns: 0
  });
  const [generatedSeating, setGeneratedSeating] = useState<any[]>([]);
  const [step, setStep] = useState<'upload' | 'config' | 'generate'>('upload');

  const handleCSVUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const lines = text.split('\n').filter(line => line.trim());
      const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
      
      const students: CSVStudent[] = [];
      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map(v => v.trim());
        if (values.length >= 4) {
          students.push({
            name: values[headers.indexOf('name')] || values[0],
            rollNumber: values[headers.indexOf('rollnumber')] || values[1],
            year: parseInt(values[headers.indexOf('year')] || values[2]) || 1,
            section: values[headers.indexOf('section')] || values[3]
          });
        }
      }
      
      setCsvStudents(students);
      setStep('config');
    };
    reader.readAsText(file);
  };

  const downloadSampleCSV = () => {
    const sampleData = [
      'Name,RollNumber,Year,Section',
      'John Smith,CS2021001,3,A',
      'Alice Johnson,CS2022001,2,B',
      'Bob Wilson,CS2023001,1,A',
      'Carol Davis,CS2021002,3,B'
    ].join('\n');
    
    const blob = new Blob([sampleData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sample_students.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const generateSeatingArrangement = () => {
    const classroom = classrooms.find(c => c.id === selectedClassroom);
    if (!classroom || csvStudents.length === 0) return;

    // Group students by year
    const studentsByYear = csvStudents.reduce((acc, student) => {
      if (!acc[student.year]) acc[student.year] = [];
      acc[student.year].push(student);
      return acc;
    }, {} as Record<number, CSVStudent[]>);

    const years = Object.keys(studentsByYear).map(Number).sort();
    const seating: any[] = [];

    if (classroom.type === 'room') {
      // Room seating arrangement
      const { numberOfBenches, studentsPerBench } = roomConfig;
      let studentIndex = 0;
      const allStudents = csvStudents.slice(0, roomConfig.numberOfStudents);
      
      for (let bench = 1; bench <= numberOfBenches; bench++) {
        const benchSeats: any[] = [];
        
        for (let seat = 1; seat <= studentsPerBench; seat++) {
          if (studentIndex < allStudents.length) {
            // Implement year mixing logic
            let selectedStudent;
            
            if (studentsPerBench === 2) {
              // For 2 seats: alternate years
              const yearIndex = (seat - 1) % years.length;
              const targetYear = years[yearIndex];
              const availableStudents = studentsByYear[targetYear]?.filter(s => 
                !seating.some(seat => seat.student?.rollNumber === s.rollNumber)
              );
              
              if (availableStudents && availableStudents.length > 0) {
                selectedStudent = availableStudents[0];
              } else {
                // Fallback to any available student
                selectedStudent = allStudents.find(s => 
                  !seating.some(seat => seat.student?.rollNumber === s.rollNumber)
                );
              }
            } else if (studentsPerBench === 3) {
              // For 3 seats: Year A, Year B, Year A pattern
              const pattern = [0, 1, 0]; // indices for years array
              const yearIndex = pattern[(seat - 1) % 3];
              const targetYear = years[yearIndex % years.length];
              const availableStudents = studentsByYear[targetYear]?.filter(s => 
                !seating.some(seat => seat.student?.rollNumber === s.rollNumber)
              );
              
              if (availableStudents && availableStudents.length > 0) {
                selectedStudent = availableStudents[0];
              } else {
                selectedStudent = allStudents.find(s => 
                  !seating.some(seat => seat.student?.rollNumber === s.rollNumber)
                );
              }
            } else {
              // For other configurations, just alternate
              const yearIndex = (seat - 1) % years.length;
              const targetYear = years[yearIndex];
              const availableStudents = studentsByYear[targetYear]?.filter(s => 
                !seating.some(seat => seat.student?.rollNumber === s.rollNumber)
              );
              
              if (availableStudents && availableStudents.length > 0) {
                selectedStudent = availableStudents[0];
              } else {
                selectedStudent = allStudents.find(s => 
                  !seating.some(seat => seat.student?.rollNumber === s.rollNumber)
                );
              }
            }

            if (selectedStudent) {
              benchSeats.push({
                benchNumber: bench,
                seatNumber: seat,
                student: selectedStudent,
                position: `B${bench}S${seat}`
              });
              studentIndex++;
            }
          } else {
            benchSeats.push({
              benchNumber: bench,
              seatNumber: seat,
              student: null,
              position: `B${bench}S${seat}`
            });
          }
        }
        seating.push(...benchSeats);
      }
    } else {
      // Seminar hall seating arrangement
      const { numberOfRows, numberOfColumns } = hallConfig;
      let studentIndex = 0;
      const allStudents = csvStudents.slice(0, hallConfig.numberOfStudents);
      
      for (let row = 1; row <= numberOfRows; row++) {
        for (let col = 1; col <= numberOfColumns; col++) {
          if (studentIndex < allStudents.length) {
            // Alternate years across columns
            const yearIndex = (col - 1) % years.length;
            const targetYear = years[yearIndex];
            const availableStudents = studentsByYear[targetYear]?.filter(s => 
              !seating.some(seat => seat.student?.rollNumber === s.rollNumber)
            );
            
            let selectedStudent;
            if (availableStudents && availableStudents.length > 0) {
              selectedStudent = availableStudents[0];
            } else {
              selectedStudent = allStudents.find(s => 
                !seating.some(seat => seat.student?.rollNumber === s.rollNumber)
              );
            }

            if (selectedStudent) {
              seating.push({
                row: row,
                column: col,
                student: selectedStudent,
                position: `R${row}C${col}`
              });
              studentIndex++;
            }
          } else {
            seating.push({
              row: row,
              column: col,
              student: null,
              position: `R${row}C${col}`
            });
          }
        }
      }
    }

    setGeneratedSeating(seating);
    setStep('generate');
  };

  const saveSeatingArrangement = () => {
    if (selectedExam && selectedClassroom && generatedSeating.length > 0) {
      addSeatingArrangement({
        examId: selectedExam,
        classroomId: selectedClassroom,
        seats: generatedSeating
      });
      alert('Seating arrangement saved successfully!');
      
      // Reset form
      setStep('upload');
      setCsvStudents([]);
      setGeneratedSeating([]);
      setSelectedExam('');
      setSelectedClassroom('');
    }
  };

  const downloadSeatingArrangement = (format: 'csv' | 'pdf') => {
    if (generatedSeating.length === 0) {
      alert('No seating arrangement to download');
      return;
    }

    const exam = exams.find(e => e.id === selectedExam);
    const classroom = classrooms.find(c => c.id === selectedClassroom);

    if (format === 'csv') {
      // Generate CSV content
      const csvContent = [
        'Position,Student Name,Roll Number,Year,Section,Bench Number,Seat Number,Row,Column',
        ...generatedSeating
          .filter(seat => seat.student)
          .map(seat => [
            seat.position,
            seat.student?.name || '',
            seat.student?.rollNumber || '',
            seat.student?.year || '',
            seat.student?.section || '',
            seat.benchNumber || '',
            seat.seatNumber || '',
            seat.row || '',
            seat.column || ''
          ].join(','))
      ].join('\n');

      // Download CSV
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `seating_arrangement_${exam?.subject || 'exam'}_${exam?.date || 'date'}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
    } else if (format === 'pdf') {
      // Generate PDF content (simplified HTML for PDF generation)
      const pdfContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Seating Arrangement - ${exam?.subject || 'Exam'}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { text-align: center; margin-bottom: 30px; }
            .exam-info { margin-bottom: 20px; }
            .seating-grid { display: grid; gap: 5px; margin: 20px 0; }
            .seat { border: 1px solid #ccc; padding: 8px; text-align: center; font-size: 12px; }
            .occupied { background-color: #e3f2fd; }
            .empty { background-color: #f5f5f5; color: #999; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Seating Arrangement</h1>
            <h2>${exam?.subject || 'Exam'}</h2>
          </div>
          <div class="exam-info">
            <p><strong>Date:</strong> ${exam ? new Date(exam.date).toLocaleDateString() : 'N/A'}</p>
            <p><strong>Time:</strong> ${exam?.time || 'N/A'}</p>
            <p><strong>Classroom:</strong> ${classroom?.name || 'N/A'}</p>
            <p><strong>Total Students:</strong> ${generatedSeating.filter(s => s.student).length}</p>
          </div>
          <table>
            <thead>
              <tr>
                <th>Position</th>
                <th>Student Name</th>
                <th>Roll Number</th>
                <th>Year</th>
                <th>Section</th>
              </tr>
            </thead>
            <tbody>
              ${generatedSeating
                .filter(seat => seat.student)
                .map(seat => `
                  <tr>
                    <td>${seat.position}</td>
                    <td>${seat.student?.name || ''}</td>
                    <td>${seat.student?.rollNumber || ''}</td>
                    <td>${seat.student?.year || ''}</td>
                    <td>${seat.student?.section || ''}</td>
                  </tr>
                `).join('')}
            </tbody>
          </table>
        </body>
        </html>
      `;

      // Open in new window for printing/saving as PDF
      const newWindow = window.open('', '_blank');
      if (newWindow) {
        newWindow.document.write(pdfContent);
        newWindow.document.close();
        newWindow.print();
      }
    }
  };

  const selectedExamData = exams.find(e => e.id === selectedExam);
  const selectedClassroomData = classrooms.find(c => c.id === selectedClassroom);

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Seating Arrangements</h1>
        <p className="text-gray-600 mt-1">Generate and manage exam seating arrangements</p>
      </div>

      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-center space-x-8">
          <div className={`flex items-center ${step === 'upload' ? 'text-blue-600' : step === 'config' || step === 'generate' ? 'text-green-600' : 'text-gray-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 'upload' ? 'bg-blue-100' : step === 'config' || step === 'generate' ? 'bg-green-100' : 'bg-gray-100'}`}>
              <Upload className="w-4 h-4" />
            </div>
            <span className="ml-2 font-medium">Upload Students</span>
          </div>
          <ArrowRight className="w-4 h-4 text-gray-400" />
          <div className={`flex items-center ${step === 'config' ? 'text-blue-600' : step === 'generate' ? 'text-green-600' : 'text-gray-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 'config' ? 'bg-blue-100' : step === 'generate' ? 'bg-green-100' : 'bg-gray-100'}`}>
              <Building2 className="w-4 h-4" />
            </div>
            <span className="ml-2 font-medium">Configure Room</span>
          </div>
          <ArrowRight className="w-4 h-4 text-gray-400" />
          <div className={`flex items-center ${step === 'generate' ? 'text-blue-600' : 'text-gray-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 'generate' ? 'bg-blue-100' : 'bg-gray-100'}`}>
              <Users className="w-4 h-4" />
            </div>
            <span className="ml-2 font-medium">Generate Seating</span>
          </div>
        </div>
      </div>

      {/* Step 1: Upload CSV */}
      {step === 'upload' && (
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Upload Student List</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Exam
                </label>
                <select
                  value={selectedExam}
                  onChange={(e) => setSelectedExam(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Choose an exam</option>
                  {exams.filter(e => e.status === 'scheduled').map(exam => (
                    <option key={exam.id} value={exam.id}>
                      {exam.subject} - Year {exam.year} Section {exam.section}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload CSV File
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">Upload a CSV file with student information</p>
                  <input
                    type="file"
                    accept=".csv"
                    onChange={handleCSVUpload}
                    className="hidden"
                    id="csv-upload"
                  />
                  <label
                    htmlFor="csv-upload"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer transition-colors"
                  >
                    <Upload className="w-4 h-4" />
                    Choose CSV File
                  </label>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2">CSV Format Required:</h4>
                <p className="text-sm text-blue-800 mb-2">Name, RollNumber, Year, Section</p>
                <button
                  onClick={downloadSampleCSV}
                  className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800"
                >
                  <Download className="w-4 h-4" />
                  Download Sample CSV
                </button>
              </div>

              {csvStudents.length > 0 && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-green-800 font-medium">
                    ✓ Successfully loaded {csvStudents.length} students
                  </p>
                  <div className="mt-2 max-h-32 overflow-y-auto">
                    <div className="text-sm text-green-700">
                      {csvStudents.slice(0, 5).map((student, index) => (
                        <div key={index}>
                          {student.name} ({student.rollNumber}) - Year {student.year}, Section {student.section}
                        </div>
                      ))}
                      {csvStudents.length > 5 && <div>... and {csvStudents.length - 5} more</div>}
                    </div>
                  </div>
                  <button
                    onClick={() => setStep('config')}
                    disabled={!selectedExam}
                    className="mt-3 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Continue to Configuration
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Step 2: Configure Room */}
      {step === 'config' && (
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Configure Classroom</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Classroom
                </label>
                <select
                  value={selectedClassroom}
                  onChange={(e) => setSelectedClassroom(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Choose a classroom</option>
                  {classrooms.filter(c => c.available).map(classroom => (
                    <option key={classroom.id} value={classroom.id}>
                      {classroom.name} ({classroom.type}) - {classroom.capacity} capacity
                    </option>
                  ))}
                </select>
              </div>

              {selectedClassroomData && (
                <div className="space-y-4">
                  {selectedClassroomData.type === 'room' ? (
                    <div className="space-y-4">
                      <h3 className="font-medium text-gray-900">Room Configuration</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Number of Students
                          </label>
                          <input
                            type="number"
                            value={roomConfig.numberOfStudents}
                            onChange={(e) => setRoomConfig({...roomConfig, numberOfStudents: parseInt(e.target.value) || 0})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            max={csvStudents.length}
                            min="1"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Number of Benches
                          </label>
                          <input
                            type="number"
                            value={roomConfig.numberOfBenches}
                            onChange={(e) => setRoomConfig({...roomConfig, numberOfBenches: parseInt(e.target.value) || 0})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            min="1"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Students per Bench
                          </label>
                          <select
                            value={roomConfig.studentsPerBench}
                            onChange={(e) => setRoomConfig({...roomConfig, studentsPerBench: parseInt(e.target.value)})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value={1}>1</option>
                            <option value={2}>2</option>
                            <option value={3}>3</option>
                            <option value={4}>4</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <h3 className="font-medium text-gray-900">Seminar Hall Configuration</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Number of Students
                          </label>
                          <input
                            type="number"
                            value={hallConfig.numberOfStudents}
                            onChange={(e) => setHallConfig({...hallConfig, numberOfStudents: parseInt(e.target.value) || 0})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            max={csvStudents.length}
                            min="1"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Number of Rows
                          </label>
                          <input
                            type="number"
                            value={hallConfig.numberOfRows}
                            onChange={(e) => setHallConfig({...hallConfig, numberOfRows: parseInt(e.target.value) || 0})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            min="1"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Number of Columns
                          </label>
                          <input
                            type="number"
                            value={hallConfig.numberOfColumns}
                            onChange={(e) => setHallConfig({...hallConfig, numberOfColumns: parseInt(e.target.value) || 0})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            min="1"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <h4 className="font-medium text-yellow-900 mb-2">Seating Rules:</h4>
                    <ul className="text-sm text-yellow-800 space-y-1">
                      <li>• Students from different years will be mixed</li>
                      <li>• No two students from the same year will sit together</li>
                      {selectedClassroomData.type === 'room' && roomConfig.studentsPerBench === 3 && (
                        <li>• 3-seat benches: Year A, Year B, Year A pattern</li>
                      )}
                    </ul>
                  </div>

                  <button
                    onClick={generateSeatingArrangement}
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Generate Seating Arrangement
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Step 3: Generated Seating */}
      {step === 'generate' && generatedSeating.length > 0 && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Generated Seating Layout</h2>
              <div className="flex gap-2">
                <button
                  onClick={() => downloadSeatingArrangement('csv')}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Download CSV
                </button>
                <button
                  onClick={() => downloadSeatingArrangement('pdf')}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Download PDF
                </button>
                <button
                  onClick={saveSeatingArrangement}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Save Arrangement
                </button>
              </div>
            </div>
            
            <div className="space-y-4">
              {selectedClassroomData?.type === 'room' ? (
                // Room layout
                <div className="space-y-2">
                  {Array.from({ length: roomConfig.numberOfBenches }, (_, benchIndex) => (
                    <div key={benchIndex} className="flex items-center gap-2">
                      <span className="text-xs font-medium text-gray-500 w-12">B{benchIndex + 1}</span>
                      <div className="flex gap-1">
                        {generatedSeating
                          .filter(seat => seat.benchNumber === benchIndex + 1)
                          .map((seat, seatIndex) => (
                            <div
                              key={seatIndex}
                              className={`w-20 h-16 border rounded text-xs flex flex-col items-center justify-center ${
                                seat.student 
                                  ? 'bg-blue-100 border-blue-300' 
                                  : 'bg-gray-50 border-gray-200'
                              }`}
                            >
                              {seat.student ? (
                                <>
                                  <span className="font-medium truncate w-full text-center px-1">
                                    {seat.student.name.split(' ')[0]}
                                  </span>
                                  <span className="text-gray-500 text-xs">Y{seat.student.year}</span>
                                  <span className="text-gray-400 text-xs">{seat.student.rollNumber}</span>
                                </>
                              ) : (
                                <span className="text-gray-400">Empty</span>
                              )}
                            </div>
                          ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                // Seminar hall layout
                <div className="space-y-1">
                  {Array.from({ length: hallConfig.numberOfRows }, (_, rowIndex) => (
                    <div key={rowIndex} className="flex items-center gap-1">
                      <span className="text-xs font-medium text-gray-500 w-8">R{rowIndex + 1}</span>
                      <div className="flex gap-1">
                        {generatedSeating
                          .filter(seat => seat.row === rowIndex + 1)
                          .map((seat, seatIndex) => (
                            <div
                              key={seatIndex}
                              className={`w-16 h-12 border rounded text-xs flex flex-col items-center justify-center ${
                                seat.student 
                                  ? 'bg-blue-100 border-blue-300' 
                                  : 'bg-gray-50 border-gray-200'
                              }`}
                            >
                              {seat.student ? (
                                <>
                                  <span className="font-medium text-xs truncate">
                                    {seat.student.name.split(' ')[0].substring(0, 6)}
                                  </span>
                                  <span className="text-gray-500 text-xs">Y{seat.student.year}</span>
                                </>
                              ) : (
                                <span className="text-gray-400 text-xs">-</span>
                              )}
                            </div>
                          ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Statistics */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Seating Statistics</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {generatedSeating.filter(s => s.student).length}
                </div>
                <div className="text-sm text-gray-600">Students Seated</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {new Set(generatedSeating.filter(s => s.student).map(s => s.student.year)).size}
                </div>
                <div className="text-sm text-gray-600">Years Mixed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {generatedSeating.filter(s => !s.student).length}
                </div>
                <div className="text-sm text-gray-600">Empty Seats</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SeatingArrangements;