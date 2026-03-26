import * as classService from './class.service.js';

export const createClass = async (req, res) => {
    const tenantId = req.user.tenantId;
    const { subject, schedule_day, schedule_time, monthly_fee } = req.body;

    const data = {
        subject: subject?.trim(),
        schedule_day,
        schedule_time,
        monthly_fee: parseFloat(monthly_fee),
    };

    if (
        !data.subject ||
        !data.schedule_day ||
        !data.schedule_time ||
        !data.monthly_fee
    ) {
        return res.status(400).json({ message: 'Missing details.' });
    }

    try {
        const newClass = await classService.createClass(tenantId, data);
        res.status(201).json({ message: 'New class created', data: newClass });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to create class.' });
    }
};

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

    if (!classId.trim()) {
        return res.status(400).json({ message: 'Invalid class id.' });
    }

    try {
        const result = await classService.getClassById(tenantId, classId);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Class not found.' });
        }

        const fetchedClass = result.rows[0];

        res.status(200).json({ message: 'Class fetched.', data: fetchedClass });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching class.' });
    }
};

export const updateClass = async (req, res) => {
    const tenantId = req.user.tenantId;
    const classId = req.params.id;
    const { subject, schedule_day, schedule_time, monthly_fee } = req.body;

    const errors = {};
    const updates = {};

    if (!classId.trim()) {
        return res.status(400).json({ message: 'Invalid class id.' });
    }

    // Subject
    if (subject === undefined || subject.trim().length < 3) {
        errors.subject = 'Subject must be a string at least 3 characters long.';
    } else {
        updates.subject = subject.trim();
    }

    // Schedule day
    if (schedule_day === undefined || schedule_day.trim().length < 6) {
        errors.schedule_day = 'Missing schedule day.';
    } else {
        const validDays = [
            'Monday',
            'Tuesday',
            'Wednesday',
            'Thursday',
            'Friday',
            'Saturday',
            'Sunday',
        ];
        if (!validDays.includes(schedule_day)) {
            errors.schedule_day = 'Invalid day of the week.';
        } else {
            updates.schedule_day = schedule_day;
        }
    }

    // Schedule time
    if (schedule_time === undefined || schedule_time.trim().length === 0) {
        errors.schedule_time = 'Missing schedule time.';
    } else {
        updates.schedule_time = schedule_time;
    }

    // Monthly fee
    if (
        monthly_fee === undefined ||
        monthly_fee === null ||
        String(monthly_fee).trim().length === 0
    ) {
        errors.monthly_fee = 'Monthly fee is required and cannot be empty.';
    } else {
        const fee = parseFloat(monthly_fee);
        if (Number.isNaN(fee) || fee < 0) {
            errors.monthly_fee = 'Monthly fee must be a positive number.';
        } else {
            updates.monthly_fee = fee;
        }
    }

    // Check if any validation failed
    if (Object.keys(errors).length > 0) {
        return res.status(400).json({ errors });
    }

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
        console.error(error);
        res.status(500).json({ message: 'Error updating class.' });
    }
};

export const deleteClass = async (req, res) => {
    const tenantId = req.user.tenantId;
    const classId = req.params.id;

    if (!classId.trim()) {
        return res.status(400).json({ message: 'Invalid class ID.' });
    }

    try {
        const result = await classService.deleteClass(tenantId, classId);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Class not found.' });
        }

        const deletedClass = result.rows[0];

        res.status(200).json({ message: 'Class deleted.', data: deletedClass });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error removing class.' });
    }
};

// ENROLLMENT

// Enroll student
export const enrollStudent = async (req, res) => {
    try {
        const tenantId = req.user.tenantId;
        const classId = req.params.classId;
        const { studentId } = req.body;

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

    if (!classId.trim()) {
        return res.status(400).json({ message: 'Invalid class ID.' });
    }

    try {
        const students = await classService.getStudentsInClass(
            tenantId,
            classId,
        );
        res.status(200).json(students);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching students.' });
    }
};

// Remove enrolled student
export const removeStudentFromClass = async (req, res) => {
    const tenantId = req.user.tenantId;
    const { classId, studentId } = req.params;

    if (!classId.trim()) {
        return res.status(400).json({ message: 'Invalid class ID.' });
    }

    if (!studentId.trim()) {
        return res.status(400).json({ message: 'Invalid student ID.' });
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
        console.error(error);
        res.status(500).json({ message: 'Error removing student.' });
    }
};
