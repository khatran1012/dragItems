document.addEventListener("DOMContentLoaded", function() {
    const data = {
        "question": {
            "paragraph": "The sky is [_input] and the grass is [_input]. You should drag the word <span style='color: red;'>green</span> to the correct blank.",
            "blanks": [
                { "id": 1, "position": "first", "correctAnswer": "blue", "type": "input" },
                { "id": 2, "position": "second", "correctAnswer": "green", "type": "drag" }
            ],
            "dragWords": [
                { "word": "blue", "color": "default", "id": 1 },
                { "word": "green", "color": "red", "id": 2 },
                { "word": "yellow", "color": "default", "id": 3 },
                { "word": "red", "color": "default", "id": 4 }
            ]
        }
    };

    const app = document.getElementById("app");

    const paragraph = data.question.paragraph.split('[_input]').map((text, index) => {
        if (index < data.question.blanks.length) {
            return `${text}<span class="droppable" data-index="${index}"></span>`;
        }
        return text;
    }).join('');

    app.innerHTML = `
    <p style="font-size: 25px;">Kéo thả từ vào ô trống</p>
    <p>${paragraph}</p>
    <div class="words">
      ${data.question.dragWords.map(word => `<span class="draggable" draggable="true" style="color: ${word.color === 'red' ? 'red' : 'black'}">${word.word}</span>`).join('')}
    </div>
    <button id="submit">SUBMIT</button>
    <p id="result"></p>
  `;

    document.querySelectorAll('.draggable').forEach(el => {
        el.addEventListener('dragstart', function(event) {
            event.dataTransfer.setData("text", event.target.innerText);
        });
    });

    document.querySelectorAll('.droppable').forEach(el => {
        el.addEventListener('dragover', function(event) {
            event.preventDefault();
        });

        el.addEventListener('drop', function(event) {
            event.preventDefault();
            const droppedWord = event.dataTransfer.getData("text");
            const index = event.target.getAttribute('data-index');
            const correctAnswer = data.question.blanks[index].correctAnswer;

            if (droppedWord === correctAnswer) {
                event.target.innerText = droppedWord;
                event.target.classList.add("filled");
                document.querySelector(`.draggable:contains(${droppedWord})`).remove();
            } else {
                alert("Sai rồi!");
            }
        });
    });

    document.getElementById("submit").addEventListener('click', function() {
        const filledBlanks = Array.from(document.querySelectorAll('.droppable')).map(el => el.innerText);
        if (filledBlanks[0] === "blue" && filledBlanks[1] === "green") {
            document.getElementById("result").innerText = "Chính xác!";
            document.getElementById("result").classList.add("success");
        } else {
            document.getElementById("result").innerText = "Sai rồi!";
            document.getElementById("result").classList.add("error");
        }
    });
});
