const DAYS = ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница']
const LESSONS_PER_DAY = 6
const CLASSES = ['5А', '5Б', '6А', '6Б']

const SUBJECTS = {
	Математика: { teacher: 'Иванов', hours: 4, room: 101 },
	'Русский язык': { teacher: 'Петров', hours: 4, room: 102 },
	История: { teacher: 'Сидоров', hours: 2, room: 103 },
	Физика: { teacher: 'Васильев', hours: 2, room: 201 },
	Химия: { teacher: 'Смирнова', hours: 2, room: 202 },
	'Английский язык': { teacher: 'Кузнецова', hours: 3, room: 104 },
	Физкультура: {
		teacher: 'Сергеев',
		hours: 2,
		room: 'Спортзал',
		groups: [
			['5А', '5Б'],
			['6А', '6Б'],
		],
	},
	Музыка: {
		teacher: 'Лебедева',
		hours: 1,
		room: 301,
		groups: [['5А', '5Б', '6А', '6Б']],
	},
	ОБЖ: { teacher: 'Михайлов', hours: 1, room: 302, groups: [['6А', '6Б']] },
}

// Создаем пустое расписание
let schedule = {}
CLASSES.forEach(className => {
	schedule[className] = {}
	DAYS.forEach(day => {
		schedule[className][day] = Array(LESSONS_PER_DAY).fill('—')
	})
})

// Функция проверки возможности установки урока
function canPlaceLesson(className, day, slot, subject, teacher) {
	if (slot > 0 && schedule[className][day][slot - 1].startsWith(subject))
		return false

	for (let c of CLASSES) {
		if (
			schedule[c][day][slot] !== '—' &&
			schedule[c][day][slot].includes(teacher)
		)
			return false
	}

	return true
}

// Заполняем обычные предметы
let subjectPool = {}
Object.entries(SUBJECTS).forEach(([subject, info]) => {
	subjectPool[subject] = []
	CLASSES.forEach(className => {
		for (let i = 0; i < info.hours; i++) {
			subjectPool[subject].push(className)
		}
	})
})

// Размещаем предметы по расписанию
Object.keys(subjectPool)
	.sort(() => Math.random() - 0.5)
	.forEach(subject => {
		while (subjectPool[subject].length > 0) {
			let className = subjectPool[subject].splice(
				Math.floor(Math.random() * subjectPool[subject].length),
				1
			)[0]
			let placed = false
			let attempts = 0

			while (!placed && attempts < 100) {
				attempts++
				let day = DAYS[Math.floor(Math.random() * DAYS.length)]
				let slot = Math.floor(Math.random() * LESSONS_PER_DAY)

				if (
					schedule[className][day][slot] === '—' &&
					canPlaceLesson(
						className,
						day,
						slot,
						subject,
						SUBJECTS[subject].teacher
					)
				) {
					schedule[className][day][
						slot
					] = `${subject} (${SUBJECTS[subject].teacher}, каб. ${SUBJECTS[subject].room})`
					placed = true
				}
			}
		}
	})

// Вывод расписания
Object.entries(schedule).forEach(([className, days]) => {
	console.log(`\n=== Расписание для класса ${className} ===`)
	Object.entries(days).forEach(([day, slots]) => {
		console.log(`\n${day}:`)
		slots.forEach((lesson, i) => {
			console.log(`${i + 1}-й урок: ${lesson}`)
		})
	})
})
