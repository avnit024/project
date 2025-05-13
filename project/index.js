document.addEventListener("DOMContentLoaded", function () {
    const problemForm = document.getElementById("problemForm");
    const problemTable = document.getElementById("problemTable").getElementsByTagName("tbody")[0];
    const editIndex = document.getElementById("editIndex");
    let problems = JSON.parse(localStorage.getItem("problems")) || [];

    function saveToLocalStorage() {
        localStorage.setItem("problems", JSON.stringify(problems));
        renderTable();
        updateChart();
    }

    function renderTable() {
        problemTable.innerHTML = "";
        problems.forEach((problem, index) => {
            let row = problemTable.insertRow();
            row.innerHTML = `
                <td>${problem.name}</td>
                <td>${problem.platform}</td>
                <td>${problem.difficulty}</td>
                <td>${problem.category}</td>
                <td>${problem.date}</td>
                <td>${problem.timeTaken} min</td>
                <td><pre>${problem.solution}</pre></td>
                <td>
                    <button onclick="editProblem(${index})">Edit</button>
                    <button onclick="deleteProblem(${index})">Delete</button>
                </td>
            `;
        });
    }

    function updateChart() {
        const counts = { Easy: 0, Medium: 0, Hard: 0 };
        problems.forEach(p => counts[p.difficulty]++);
        const ctx = document.getElementById("progressChart").getContext("2d");
        new Chart(ctx, {
            type: "pie",
            data: {
                labels: ["Easy", "Medium", "Hard"],
                datasets: [{
                    label: "Problems Solved",
                    data: [counts.Easy, counts.Medium, counts.Hard],
                    backgroundColor: ["green", "orange", "red"]
                }]
            }
        });
    }

    problemForm.addEventListener("submit", function (e) {
        e.preventDefault();
        const problem = {
            name: document.getElementById("problemName").value,
            platform: document.getElementById("platform").value,
            difficulty: document.getElementById("difficulty").value,
            category: document.getElementById("category").value,
            date: document.getElementById("date").value,
            timeTaken: document.getElementById("timeTaken").value,
            solution: document.getElementById("solutionCode").value
        };

        if (editIndex.value !== "") {
            problems[editIndex.value] = problem;
            editIndex.value = "";
        } else {
            problems.push(problem);
        }

        saveToLocalStorage();
        problemForm.reset();
    });

    window.editProblem = function (index) {
        let p = problems[index];
        document.getElementById("problemName").value = p.name;
        document.getElementById("platform").value = p.platform;
        document.getElementById("difficulty").value = p.difficulty;
        document.getElementById("category").value = p.category;
        document.getElementById("date").value = p.date;
        document.getElementById("timeTaken").value = p.timeTaken;
        document.getElementById("solutionCode").value = p.solution;
        editIndex.value = index;
    };

    window.deleteProblem = function (index) {
        problems.splice(index, 1);
        saveToLocalStorage();
    };

    renderTable();
    updateChart();
});
