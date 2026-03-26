import * as classService from './class.service.js';

// Shared ID validation utility
function isValidUUID(uuid) {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return typeof uuid === 'string' && uuidRegex.test(uuid);
}

export const createClass = async (req, res) => {
    const tenantId = req.user.tenantId;
    const { subject, schedule_day, schedule_time, monthly_fee } = req.body;

    // Validation
    let errors = [];

    // Validate subject
    if (typeof subject !== 'string' || subject.trim().length === 0) {
        errors.push('Subject must be a non-empty string.');
    }

    // Validate monthly_fee
    const parsedFee = parseFloat(monthly_fee);
    if (isNaN(parsedFee) || parsedFee < 0) {
        errors.push('Monthly fee must be a non-negative number.');
    }

    // Validate schedule_day
    const allowedDays = [
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
        'Sunday',
    ];
    if (
        typeof schedule_day !== 'string' ||
        !allowedDays.includes(schedule_day)
    ) {
        errors.push('Schedule day must be a valid day of the week.');
    }

    // Validate schedule_time
    const timeRegex = /^\d{2}:\d{2}(:\d{2})?$/;
    if (typeof schedule_time !== 'string' || !timeRegex.test(schedule_time)) {
        errors.push('Schedule time must be in HH:MM or HH:MM:SS format.');
    }

    if (errors.length > 0) {
        return res.status(400).json({ message: 'Validation failed.', errors });
    }

    // Build data object from validated values
    const data = {
        subject: subject.trim(),
        schedule_day,
        schedule_time,
        monthly_fee: parsedFee,
    };

    try {
        const newClass = await classService.createClass(tenantId, data);
        res.status(201).json({ message: 'New class created', data: newClass });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to create class.' });
    }
};;;

export const getClassesWithCount = async (req, res) => {
    const tenantId = req.user.tenantId;
    const page = Math.max(Number.parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.max(
        1,
        Math.min(Number.parseInt(req.query.limit, 10) || 20, 100),
    );
    const offset = (page - 1) * limit;

    try {
        const { rows: classes, totalCount } =
            await classService.getClassesWithCount(tenantId, limit, offset);

        res.status(200).json({
            message: 'Classes fetched.',
            data: classes,
            pagination: {
                page,
                limit,
                totalCount,
                totalPages: Math.ceil(totalCount / limit),
            },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error.' });
    }
};

export const getClass = async (req, res) => {
    const tenantId = req.user.tenantId;
    const classId = req.params.id;

    if (!isValidUUID(classId)) {
        return res.status(400).json({ message: 'Invalid id.' });
    }

    try {
        const result = await classService.getClassById(tenantId, classId);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Class not found.' });
        }

        const fetchedClass = result.rows[0];

        res.status(200).json({ message: 'Class fetched.', data: fetchedClass });
    } catch (error) {
        if (error.code === '22P02') {
            return res.status(400).json({ message: 'Invalid id.' });
        }
        console.error(error);
        res.status(500).json({ message: 'Error fetching class.' });
    }
};

export const updateClass = async (req, res) => {
    const tenantId = req.user.tenantId;
    const classId = req.params.id;
    const { subject, schedule_day, schedule_time, monthly_fee } = req.body;

    let errors = [];

    if (!isValidUUID(classId)) {
        return res.status(400).json({ message: 'Invalid id.' });
    }

    // Subject
    if (typeof subject !== 'string' || subject.trim().length < 3) {
        errors.push('Subject must be a string at least 3 characters long.');
    }

    // Schedule day
    const validDays = [
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
        'Sunday',
    ];
    if (typeof schedule_day !== 'string' || !validDays.includes(schedule_day)) {
        errors.push('Missing schedule day.');
    }

    // Schedule time
    const timeRegex = /^\d{2}:\d{2}(:\d{2})?$/;
    if (typeof schedule_time !== 'string' || !timeRegex.test(schedule_time)) {
        errors.push('Schedule time must be in HH:MM or HH:MM:SS format.');
    }

    // Monthly fee
    const parsedFee = parseFloat(monthly_fee);
    if (isNaN(parsedFee) || parsedFee < 0) {
        errors.push('Monthly fee must be a non-negative number.');
    }

    // Check if any validation failed
    if (errors.length > 0) {
        return res.status(400).json({ message: 'Validation failed.', errors });
    }

    const updates = {
        subject: subject.trim(),
        schedule_day,
        schedule_time,
        monthly_fee: parsedFee,
    };

    try {
        const result = await classService.updateClass(
            tenantId,
            classId,
            updates,
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Class not found' });
        }

        const updatedClass = result.rows[0];

        res.status(200).json({
            message: 'Class updated',
            data: updatedClass,
        });
    } catch (error) {
        if (error.code === '22P02') {
            return res.status(400).json({ message: 'Invalid id.' });
        }
        console.error(error);
        res.status(500).json({ message: 'Error updating class.' });
    }
};;

export const deleteClass = async (req, res) => {
    const tenantId = req.user.tenantId;
    const classId = req.params.id;

    if (!isValidUUID(classId)) {
        return res.status(400).json({ message: 'Invalid id.' });
    }

    try {
        const result = await classService.deleteClass(tenantId, classId);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Class not found.' });
        }

        const deletedClass = result.rows[0];

        res.status(200).json({ message: 'Class deleted.', data: deletedClass });
    } catch (error) {
        if (error.code === '22P02') {
            return res.status(400).json({ message: 'Invalid id.' });
        }
        console.error(error);
        res.status(500).json({ message: 'Error removing class.' });
    }
};

// ENROLLMENT

// Enroll student
export const enrollStudent = async (req, res) => {
    const tenantId = req.user.tenantId;
    const classId = req.params.classId;
    const { studentId } = req.body;

    if (!isValidUUID(classId)) {
        return res.status(400).json({ message: 'Invalid id.' });
    }

    if (!isValidUUID(studentId)) {
        return res.status(400).json({ message: 'Invalid id.' });
    }

    try {
        const enrollment = await classService.enrollStudent(
            tenantId,
            classId,
            studentId,
        );

        res.status(201).json({
            message: 'Student enrolled successfully.',
            data: enrollment,
        });
    } catch (error) {
        if (error.code === '22P02') {
            return res.status(400).json({ message: 'Invalid id.' });
        }
        if (error.code === '23505') {
            return res.status(400).json({
                message: 'Student already enrolled in this class.',
            });
        }
        console.error(error);
        res.status(500).json({
            message: 'Failed to enroll student.',
        });
    }
};

// Get enrolled students
export const getStudentsInClass = async (req, res) => {
    const tenantId = req.user.tenantId;
    const classId = req.params.classId;

    if (!isValidUUID(classId)) {
        return res.status(400).json({ message: 'Invalid id.' });
    }

    try {
        const students = await classService.getStudentsInClass(
            tenantId,
            classId,
        );
        res.status(200).json(students);
    } catch (error) {
        if (error.code === '22P02') {
            return res.status(400).json({ message: 'Invalid id.' });
        }
        console.error(error);
        res.status(500).json({ message: 'Error fetching students.' });
    }
};

// Remove enrolled student
export const removeStudentFromClass = async (req, res) => {
    const tenantId = req.user.tenantId;
    const { classId, studentId } = req.params;

    if (!isValidUUID(classId)) {
        return res.status(400).json({ message: 'Invalid id.' });
    }

    if (!isValidUUID(studentId)) {
        return res.status(400).json({ message: 'Invalid id.' });
    }

    try {
        const result = await classService.removeStudentFromClass(
            tenantId,
            classId,
            studentId,
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Student not found.' });
        }

        const removedStudent = result.rows[0];
        res.status(200).json({
            message: 'Student removed from class.',
            data: removedStudent,
        });
    } catch (error) {
        if (error.code === '22P02') {
            return res.status(400).json({ message: 'Invalid id.' });
        }
        console.error(error);
        res.status(500).json({ message: 'Error removing student.' });
    }
};
