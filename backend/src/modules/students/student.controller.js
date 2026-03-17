import * as studentService from './student.service.js';

export const createStudent = async (req, res) => {
    const tenantId = req.tenantId;
    const { name, parent_phone } = req.body;

    if (!name || typeof name !== 'string' || !name.trim()) {
        return res.status(400).json({ message: 'name is required' });
    }

    try {
        const student = await studentService.createStudent(tenantId, req.body);
        res.status(201).json(student);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error.' });
    }
};

export const getStudents = async (req, res) => {
    const tenantId = req.tenantId;
    const page = parseInt(req.query.page, 10) || 1;
    const limit = Math.min(parseInt(req.query.limit, 10) || 20, 100);
    const offset = (page - 1) * limit;

    try {
        const students = await studentService.getStudents(tenantId, limit, offset);
        res.json(students);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Servstudenter error.' });
    }
};

export const getStudent = async (req, res) => {
    const tenantId = req.tenantId;
    const studentId = Number.parseInt(req.params.id, 10);

    if (!Number.isInteger(studentId) || studentId <= 0) {
        return res.status(400).json({ message: 'Invalid student id.' });
    }

    try {
        const result = await studentService.getStudent(studentId, tenantId);

        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'Student not found.' });
        }

        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error.' });
    }
};

export const updateStudent = async (req, res) => {
    const tenantId = req.tenantId;
    const studentId = Number.parseInt(req.params.id, 10);

    if (!Number.isInteger(studentId) || studentId <= 0) {
        return res.status(400).json({ message: 'Invalid student id.' });
    }
    
    const { name, parent_phone } = req.body;

    if (!name || typeof name !== 'string' || !name.trim()) {
        return res.status(400).json({ message: 'name is required' });
    }

    if (parent_phone != null && typeof parent_phone !== 'string') {
        return res
            .status(400)
            .json({ message: 'parent_phone must be a string' });
    }

    try {
        const result = await studentService.updateStudent(tenantId, studentId, req.body);

        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'Student not found.' });
        }

        const updatedStudent = result.rows[0];

        res.status(200).json({
            message: "Student records updated.",
            data: updatedStudent
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error.' });
    }
};

export const deleteStudent = async (req, res) => {
    const tenantId = req.tenantId;
    const studentId = Number.parseInt(req.params.id, 10);

    if (!Number.isInteger(studentId) || studentId <= 0) {
        return res.status(400).json({ message: 'Invalid student id.' });
    }

    try {
        const result = await studentService.deleteStudent(tenantId, studentId);

        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'Student not found.' });
        }

        const deletedStudent = result.rows[0]

        res.status(200).json({
            message: 'Student deleted.',
            data: deletedStudent
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error.' });
    }
};