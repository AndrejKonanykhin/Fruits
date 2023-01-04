// элементы в DOM можно получить при помощи функции querySelector
const fruitsList = document.querySelector(".fruits__list"); // список карточек
const shuffleButton = document.querySelector(".shuffle__btn"); // кнопка перемешивания
const filterButton = document.querySelector(".filter__btn"); // кнопка фильтрации
const sortKindLabel = document.querySelector(".sort__kind"); // поле с названием сортировки
const sortTimeLabel = document.querySelector(".sort__time"); // поле с временем сортировки
const sortChangeButton = document.querySelector(".sort__change__btn"); // кнопка смены сортировки
const sortActionButton = document.querySelector(".sort__action__btn"); // кнопка сортировки
const cancelButton = document.querySelector(".cancel__btn"); // кнопка сортировки
const kindInput = document.querySelector(".kind__input"); // поле с названием вида
const colorInput = document.querySelector(".color__input"); // поле с названием цвета
const weightInput = document.querySelector(".weight__input"); // поле с весом
const addActionButton = document.querySelector(".add__action__btn"); // кнопка добавления

let enterMinWeight = document.querySelector(".minweight__input");
let enterMaxWeight = document.querySelector(".maxweight__input");

let minWeight;
let maxWeight;

enterMinWeight.addEventListener("input", (event) => {
  minWeight = parseInt(enterMinWeight.value) || 0;
  minWeight < 0 ? (enterMinWeight.value = 0) : (minWeight = minWeight);
}); // поле с минимальным весом

enterMaxWeight.addEventListener("input", (event) => {
  maxWeight = parseInt(enterMaxWeight.value) || 100;
  maxWeight < 0 ? (enterMaxWeight.value = 100) : (maxWeight = maxWeight);
}); // поле с максимальным весом

// список фруктов в JSON формате
let fruitsJSON = `[
  {"kind": "Мангустин", "color": "фиолетовый", "weight": 13},
  {"kind": "Дуриан", "color": "зеленый", "weight": 35},
  {"kind": "Личи", "color": "розово-красный", "weight": 17},
  {"kind": "Карамбола", "color": "желтый", "weight": 28},
  {"kind": "Тамаринд", "color": "светло-коричневый", "weight": 22}
]`;

// список colors в JSON формате
let colorsJSON = `[
  {"color": "баклажановый", "code": "hsl(324,100%,13%)"},
  {"color": "бежевый", "code": "hsl(60,56%,91%)"},
  {"color": "бордовый", "code": "hsl(350,57%,13%)"},
  {"color": "желтый", "code": "hsl(59,100%,48%)"},
  {"color": "зеленый", "code": "hsl(105,54%,52%)"},
  {"color": "коричневый", "code": "hsl(31,84%,13%)"},
  {"color": "красный", "code": "hsl(0,81%,42%)"},
  {"color": "оранжевый", "code": "hsl(22,91%,47%"},
  {"color": "розово-красный", "code": "hsl(348,83%,47%)"},
  {"color": "розовый", "code": "hsl(294,36%,74%)"},
  {"color": "светло-коричневый", "code": "hsl(30,59%,53%)"},
  {"color": "фиолетовый", "code": "hsl(273,100%,50%)"}
]`;

// преобразование JSON в объект JavaScript
let fruits = JSON.parse(fruitsJSON);
let origFruits = JSON.parse(fruitsJSON); // массив фруктов до фильтрации и сортировки
let colors = JSON.parse(colorsJSON);

// создание поля выбора цвета
for (let j = 0; j < colors.length; j++) {
  const colorOption = document.createElement("option");
  let colorIndex = j;
  let optionColor = colors.at(colorIndex).color;
  colorOption.textContent = optionColor;
  colorInput.appendChild(colorOption);
}

/*** ОТОБРАЖЕНИЕ ***/

// отрисовка карточек
const display = () => {
  fruitsList.innerHTML = ""; //очищаем fruitsList от вложенных элементов

  for (let i = 0; i < fruits.length; i++) {
    const fruitsListLi = document.createElement("li"); //создаем новые элементы
    fruitsListLi.className = "fruit__item";
    let itemIndex = i;
    let currentObj = fruits.at(itemIndex);
    let itemName = currentObj.kind;
    let itemColor = currentObj.color;
    let itemWeight = currentObj.weight;
    fruitsListLi.innerHTML = `<div class="fruit__info"><div>index: ${itemIndex}</div><div>kind: ${itemName}</div><div>color: ${itemColor}</div><div>weight (кг): ${itemWeight}</div></div>`;
    fruitsList.appendChild(fruitsListLi);

    let itsColor = () => colors.find((item) => item.color === itemColor); // добавляем цвет фона для элемента списка
    fruitsListLi.style.background = itsColor().code;
  }
};
// первая отрисовка карточек
document.addEventListener("DOMContentLoaded", display);

/*** ПЕРЕМЕШИВАНИЕ ***/

// генерация случайного числа в заданном диапазоне
const getRandomInt = (min = 0, max = fruits.length - 1) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// перемешивание массива
const shuffleFruits = () => {
  var result = [];
  var oldFruits = [];
  while (fruits.length > 0) {
    let randomIndex = getRandomInt();
    result.push(fruits[randomIndex]);
    fruits.splice(randomIndex, 1);
  }
  fruits = result;
};

shuffleButton.addEventListener("click", () => {
  fruits.length < 3 ? alert("Порядок не изменился!") : shuffleFruits();
  display();
});

/*** ФИЛЬТРАЦИЯ ***/

// фильтрация массива
const filterFruits = () => {
  return fruits.filter((fruit) => {
    return minWeight <= fruit.weight && fruit.weight <= maxWeight;
  });
};

enterMinWeight.addEventListener("keyup", function () {
  // вводим только цифры в поле min weight
  this.value = this.value.replace(/[^\d]/g, "");
});

enterMaxWeight.addEventListener("keyup", function () {
  // вводим только цифры в поле max weight
  this.value = this.value.replace(/[^\d]/g, "");
});

filterButton.addEventListener("click", () => {
  minWeight = parseInt(enterMinWeight.value);
  maxWeight = parseInt(enterMaxWeight.value);

  if (maxWeight > minWeight) {
    fruits = filterFruits();
    enterMaxWeight.style.outline = "none";
    enterMinWeight.style.outline = "none";
  } else {
    alert("Max weight не может быть меньше min weight!");
    enterMinWeight.value = "";
    enterMaxWeight.value = "";
    enterMaxWeight.style.outline = "3px solid red";
    enterMinWeight.style.outline = "3px solid red";
  }

  display();
});

/*** СОРТИРОВКА ***/

let sortKind = "bubbleSort"; // инициализация состояния вида сортировки
let sortTime = "-"; // инициализация состояния времени сортировки

const comparationColor = (a, b) => {
  const priority = [
    "красный",
    "оранжевый",
    "светло-коричневый",
    "коричневый",
    "желтый",
    "бежевый",
    "зеленый",
    "фиолетовый",
    "розовый",
    "баклажановый",
    "розово-красный",
    "бордовый",
  ];
  const priority1 = priority.indexOf(a.color);
  const priority2 = priority.indexOf(b.color);
  return priority1 > priority2;
};
// TODO: допишите функцию сравнения двух элементов по цвету

const sortAPI = {
  bubbleSort(arr, comparation) {
    // алгоритм пузырьковой сортировки
    const n = arr.length;
    for (let i = 0; i < n - 1; i++) {
      for (let j = 0; j < n - 1 - i; j++) {
        if (comparation(arr[j], arr[j + 1])) {
          let temp = arr[j + 1];
          arr[j + 1] = arr[j];
          arr[j] = temp;
        }
      }
    }
  },

  quickSort(arr, comparation) {
    // алгоритм быстрой сортировки
    function swap(items, firstIndex, secondIndex) {
      const temp = items[firstIndex];
      items[firstIndex] = items[secondIndex];
      items[secondIndex] = temp;
    }

    function partition(items, left, right) {
      var pivot = items[Math.floor((right + left) / 2)],
        i = left,
        j = right;
      while (i <= j) {
        while (i <= j && comparation(pivot, items[i])) {
          i++;
        }
        while (i <= j && comparation(items[j], pivot)) {
          j--;
        }
        if (i <= j) {
          swap(items, i, j);
          i++;
          j--;
        }
      }
      return i;
    }

    function quickSort(arr, start, end) {
      var index;
      if (arr.length > 1) {
        start = typeof start != "number" ? 0 : start;
        end = typeof end != "number" ? arr.length - 1 : end;
        index = partition(arr, start, end);

        if (start < index - 1) {
          quickSort(arr, start, index - 1);
        }
        if (index < end) {
          quickSort(arr, index, end);
        }
      }
    }

    quickSort(arr);
  },

  // выполняет сортировку и производит замер времени
  startSort(sort, arr, comparation) {
    const start = new Date().getTime();
    sort(arr, comparation);
    const end = new Date().getTime();
    sortTime = `${end - start} ms`;
  },
};

// инициализация полей
sortKindLabel.textContent = sortKind;
sortTimeLabel.textContent = sortTime;

sortChangeButton.addEventListener("click", () => {
  sortKindLabel.textContent == "bubbleSort"
    ? ((sortKindLabel.textContent = "quickSort"), (sortKind = "quickSort"))
    : ((sortKindLabel.textContent = "bubbleSort"), (sortKind = "bubbleSort"));
  // TODO: переключать значение sortKind между 'bubbleSort' / 'quickSort'
});

sortActionButton.addEventListener("click", () => {
  sortTimeLabel.textContent = "сортируем...";
  // TODO: вывести в sortTimeLabel значение 'sorting...'
  const sort = sortAPI[sortKind];
  sortAPI.startSort(sort, fruits, comparationColor);
  display();
  sortTimeLabel.textContent = sortTime;
  // TODO: вывести в sortTimeLabel значение sortTime
});

/*** ДОБАВИТЬ ФРУКТ ***/

kindInput.addEventListener("keyup", function () {
  // фрукт пишется с большой буквы
  this.value =
    this.value.charAt(0).toUpperCase() + this.value.slice(1).toLowerCase();
});

weightInput.addEventListener("keyup", function () {
  // вводим только цифры в поле weight
  this.value = this.value.replace(/[^\d]/g, "");
});

function fruitAddition() {
  const newFruit = {}; // создаем новый объект-фрукт

  newFruit.kind = kindInput.value;
  newFruit.color = colorInput.value;
  newFruit.weight = weightInput.value;

  // проверка заполнения полей
  if (fruits.some((fruit) => fruit.kind === newFruit.kind)) {
    alert(`Фрукт ${newFruit.kind} уже добавлен! Добавьте другой.`);
    kindInput.value = "";
    colorInput.value = "выберите цвет";
    weightInput.value = "";
    kindInput.style.outline = "3px solid red";
  } else if (kindInput.value === "") {
    kindInput.style.outline = "3px solid red";
    alert("Заполните поле 'kind'!");
  } else if (colorInput.value === "выберите цвет") {
    colorInput.style.outline = "3px solid red";
    kindInput.style.outline = "none";
    weightInput.style.outline = "none";
    alert("Выберите цвет!");
  } else if (weightInput.value === "") {
    weightInput.style.outline = "3px solid red";
    kindInput.style.outline = "none";
    colorInput.style.outline = "none";
    alert("Заполните поле 'weight'!");
  } else {
    kindInput.style.outline = "none";
    weightInput.style.outline = "none";
    colorInput.style.outline = "none";

    fruits.push(newFruit); // пушим новый обект-фрукт в массив фруктов
    origFruits.push(newFruit);
  }
}

// кнопка добавления фрукта
addActionButton.addEventListener("click", () => {
  fruitAddition();
  display();
});

// кнопка сброса к исходному порядку
cancelButton.addEventListener("click", () => {
  if (fruits !== origFruits) {
    fruits = origFruits.slice();
  }
  display();
});
