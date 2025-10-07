import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Courses() {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8000/api/courses')
      .then(response => setCourses(response.data));
  }, []);

  const applyToCourse = (id) => {
    axios.post(`http://localhost:8000/api/courses/${id}/apply`, {
      user_id: '1' // À remplacer par l'ID du livreur connecté
    }).then(res => alert(res.data.message));
  };

  return (
    <div>
      <h2>Courses disponibles</h2>
      {courses.map(course => (
        <div key={course.id} style={{marginBottom: 16}}>
          <p>{course.title}</p>
          <button onClick={() => applyToCourse(course.id)}>Postuler</button>
        </div>
      ))}
    </div>
  );
}

export default Courses;
