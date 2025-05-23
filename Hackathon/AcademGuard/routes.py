from flask import Blueprint, jsonify, current_app, request
from flask_mysqldb import MySQL
from werkzeug.security import check_password_hash
import sys

main = Blueprint('main', __name__)

@main.route('/test_db')
def test_db():
    mysql = current_app.extensions['mysql']
    cur = mysql.connection.cursor()
    cur.execute('SHOW TABLES;')
    tables = cur.fetchall()
    cur.close()
    return jsonify({'tables': tables})

@main.route('/login', methods=['POST'])
def login():
    """
    Process user authentication and create a login session.
    
    Validates provided credentials against the database and returns user information
    with appropriate role type on success. Maps database user types to frontend roles.
    
    Returns:
        JSON: User information on success or error message on failure
    """
    data = request.json
    login = data.get('login')
    password = data.get('password')
    if not login or not password:
        return jsonify({'error': 'Login and password required'}), 400
    mysql = current_app.extensions['mysql']
    cur = mysql.connection.cursor()
    cur.execute('SELECT id, login, password, type FROM user WHERE login=%s', (login,))
    user = cur.fetchone()
    cur.close()
    # Log authentication attempts for security monitoring
    print(f"[DEBUG] User found: {user}", file=sys.stderr)
    print(f"[DEBUG] Provided password: {password}", file=sys.stderr)
    if user:
        db_password = str(user['password']) if user['password'] is not None else None
        print(f"[DEBUG] DB password: {db_password}", file=sys.stderr)
        if password == db_password:
            # Map type to role for frontend
            user_type = user['type']
            if isinstance(user_type, str) and user_type.isdigit():
                user_type = int(user_type)
            return jsonify({
                'id': user['id'],
                'login': user['login'],
                'type': user_type
            })
        else:
            print("[DEBUG] Password mismatch", file=sys.stderr)
    else:
        print("[DEBUG] User not found", file=sys.stderr)
    return jsonify({'error': 'Invalid credentials'}), 401

# Student Routes
@main.route('/api/student/exams', methods=['GET'])
def get_student_exams():
    """
    Retrieve exams available for students.
    
    Returns a list of exams that are available to a specific student or all exams
    if no student_id is provided. Includes exam details such as title, course,
    date, duration, type, and status.
    """
    student_id = request.args.get('student_id', None)
    
    mysql = current_app.extensions['mysql']
    cur = mysql.connection.cursor()
    
    if student_id:
        cur.execute('SELECT * FROM exams WHERE student_id=%s', (student_id,))
    else:
        cur.execute('SELECT * FROM exams')
        
    exams = cur.fetchall()
    cur.close()
    return jsonify(exams)

@main.route('/api/student/commits/<exam_id>', methods=['GET'])
def get_student_commits(exam_id):
    """
    Retrieve GitHub commits for a specific exam.
    
    Returns all commits made by a student during a programming exam. These commits are
    tracked to monitor coding progress and ensure academic integrity. Results can be 
    filtered by student_id or show all commits for an exam.
    """
    student_id = request.args.get('student_id', None)
    
    mysql = current_app.extensions['mysql']
    cur = mysql.connection.cursor()
    
    if student_id:
        cur.execute('SELECT * FROM commits WHERE exam_id=%s AND student_id=%s', (exam_id, student_id))
    else:
        cur.execute('SELECT * FROM commits WHERE exam_id=%s', (exam_id,))
        
    commits = cur.fetchall()
    cur.close()
    return jsonify(commits)

# Professor Routes
@main.route('/api/professor/exams', methods=['GET'])
def get_professor_exams():
    """
    Retrieve exams created by professors.
    
    Returns all exams created by a specific professor if professor_id is provided,
    or all exams in the system. Includes exam metadata and the count of registered
    students for each exam for monitoring purposes.
    """
    professor_id = request.args.get('professor_id', None)
    
    mysql = current_app.extensions['mysql']
    cur = mysql.connection.cursor()
    
    if professor_id:
        cur.execute('SELECT e.*, COUNT(DISTINCT se.student_id) as students_registered FROM exams e LEFT JOIN student_exams se ON e.id = se.exam_id WHERE e.professor_id=%s GROUP BY e.id', (professor_id,))
    else:
        cur.execute('SELECT e.*, COUNT(DISTINCT se.student_id) as students_registered FROM exams e LEFT JOIN student_exams se ON e.id = se.exam_id GROUP BY e.id')
        
    exams = cur.fetchall()
    cur.close()
    return jsonify(exams)

@main.route('/api/professor/alerts', methods=['GET'])
def get_professor_alerts():
    """
    Retrieve all student activity alerts for professors.
    
    This endpoint returns alerts generated during exams, such as suspicious behaviors,
    webcam detection issues, or window switching. Results can be filtered by exam_id.
    Data includes alert severity, timestamp, and associated student information.
    """
    exam_id = request.args.get('exam_id', None)
    
    mysql = current_app.extensions['mysql']
    cur = mysql.connection.cursor()
    
    # Join alert table with user table to get student names
    if exam_id:
        cur.execute('''
            SELECT a.*, u.login as student_name 
            FROM alerts a 
            JOIN user u ON a.student_id = u.id 
            WHERE a.exam_id=%s
            ORDER BY a.timestamp DESC
        ''', (exam_id,))
    else:
        cur.execute('''
            SELECT a.*, u.login as student_name 
            FROM alerts a 
            JOIN user u ON a.student_id = u.id
            ORDER BY a.timestamp DESC
        ''')
        
    alerts = cur.fetchall()
    cur.close()
    return jsonify(alerts)

@main.route('/api/professor/exams', methods=['POST'])
def create_exam():
    """
    Create a new exam in the system.
    
    This endpoint accepts exam details submitted by professors and stores them in the database.
    It handles basic exam parameters as well as configuration for GitHub integration if enabled.
    """
    data = request.json
    
    mysql = current_app.extensions['mysql']
    cur = mysql.connection.cursor()
    
    # Insert exam data into database
    query = '''
        INSERT INTO exams (
            title, course, date, duration, type, 
            professor_id, github_required, commit_interval, instructions
        ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
    '''
    values = (
        data.get('title'),
        data.get('course'),
        data.get('date'),
        data.get('duration'),
        data.get('examType'),
        data.get('professorId'),
        data.get('githubRequired', False),
        data.get('commitInterval', 10),
        data.get('instructions', '')
    )
    
    cur.execute(query, values)
    exam_id = cur.lastrowid
    mysql.connection.commit()
    
    # If questions are provided, insert them as well
    questions = data.get('questions', [])
    for q in questions:
        q_query = 'INSERT INTO exam_questions (exam_id, text, type, options) VALUES (%s, %s, %s, %s)'
        q_values = (
            exam_id,
            q.get('text'),
            q.get('type'),
            ','.join(q.get('options', []))
        )
        cur.execute(q_query, q_values)
    
    mysql.connection.commit()
    cur.close()
    
    # Return the created exam
    return jsonify({
        "id": exam_id,
        "title": data.get('title'),
        "course": data.get('course'),
        "date": data.get('date'),
        "duration": data.get('duration'),
        "examType": data.get('examType'),
        "githubRequired": data.get('githubRequired', False)
    }), 201

# Admin Routes
@main.route('/api/admin/users', methods=['GET'])
def get_users():
    """
    Retrieve all user accounts in the system.
    
    Returns a list of users with their IDs, logins, and user type information.
    Used by administrators for user management and account oversight.
    
    Returns:
        JSON: List of user objects with basic account details
    """
    mysql = current_app.extensions['mysql']
    cur = mysql.connection.cursor()
    cur.execute('SELECT id, login, type FROM user')
    users = cur.fetchall()
    cur.close()
    return jsonify(users)

@main.route('/api/admin/verification', methods=['GET'])
def get_verification_requests():
    """
    Retrieve student identity verification requests.
    
    Gets all pending or previously processed identity verification requests.
    Can be filtered by status (pending, approved, rejected) if specified.
    Joins with user table to include student name information.
    
    Returns:
        JSON: List of verification request objects with status and details
    """
    status = request.args.get('status', None)
    
    mysql = current_app.extensions['mysql']
    cur = mysql.connection.cursor()
    
    if status:
        cur.execute('''
            SELECT v.*, u.login as student_name 
            FROM verification_requests v
            JOIN user u ON v.student_id = u.id
            WHERE v.status = %s
            ORDER BY v.submitted_at DESC
        ''', (status,))
    else:
        cur.execute('''
            SELECT v.*, u.login as student_name 
            FROM verification_requests v
            JOIN user u ON v.student_id = u.id
            ORDER BY v.submitted_at DESC
        ''')
    
    requests = cur.fetchall()
    cur.close()
    return jsonify(requests)

@main.route('/api/admin/verification/<int:request_id>', methods=['PUT'])
def update_verification_request(request_id):
    """
    Approve or reject a student identity verification request.
    
    This endpoint allows administrators to review and make decisions on student
    verification requests. When approved, the student's account is marked as verified
    in the database. Verification is required before students can take secure exams.
    """
    data = request.json
    status = data.get('status')  # 'approved' or 'rejected'
    
    if not status or status not in ['approved', 'rejected']:
        return jsonify({'error': 'Invalid status provided'}), 400
    
    mysql = current_app.extensions['mysql']
    cur = mysql.connection.cursor()
    
    # Update verification request status
    cur.execute('UPDATE verification_requests SET status = %s WHERE id = %s', 
                (status, request_id))
    
    # If approved, also update user's verification status
    if status == 'approved':
        # Get the student_id from the verification request
        cur.execute('SELECT student_id FROM verification_requests WHERE id = %s', (request_id,))
        result = cur.fetchone()
        if result:
            student_id = result['student_id']
            # Update the user's verification status
            cur.execute('UPDATE user SET verified = 1 WHERE id = %s', (student_id,))
    
    mysql.connection.commit()
    cur.close()
    
    return jsonify({'message': f'Verification request {status}'})
