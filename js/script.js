const generateButton = document.getElementById("generate");
const copyButton = document.getElementById("copy");
const outputDiv = document.getElementById("output");
const temperatureSlider = document.getElementById("temperature");
const temperatureOutput = document.getElementById("temperatureOutput");
const topPSlider = document.getElementById("topP");
const topPOutput = document.getElementById("topPOutput");
const topKInput = document.getElementById("topK");
const langOption = document.getElementById("langOption");
const deletePromptButton = document.getElementById("deletePrompt");
const charWordCount = document.getElementById("charWordCount");
const modelPrompt = document.getElementById("model");
const roleOpt = document.getElementById("roleOpt");
const writingStyleOpt = document.getElementById("writingStyleOpt");
const toneOpt = document.getElementById("toneOpt");
const sentimentOp = document.getElementById("sentiment");
const maxTokensInp = document.getElementById("maxTokens");
const freqPenaltySlider = document.getElementById("frequencyPenalty");
const freqyPenaltyOutput = document.getElementById("frequencyPenaltyOutput");
const presPenaltySlider = document.getElementById("presencePenalty");
const presPenaltyOutput = document.getElementById("presencePenaltyOutput");
const audienceText = document.getElementById("audience");
const formatOpt = document.getElementById("formatOpt");
const textAreaText = document.getElementById("text");
const textAreaContext = document.getElementById("context");
const variableNames = document.getElementsByClassName("variableName");
const variableValues = document.getElementsByClassName("variableValue");
const taskValues = document.getElementById("taskOption");
const charWordCountText = document.getElementById("charWordCountText");
const charWordCountContext = document.getElementById("charWordCountContext");

//Genera el prompt a partir de los datos
generateButton.addEventListener("click", () => {
  const text = textAreaText.value;
  const context = textAreaContext.value;
  const temperature = temperatureSlider.value;
  const topP = topPSlider.value;
  const topK = topKInput.value;
  const language = langOption.value;
  const model = modelPrompt.value;
  const role = roleOpt.value;
  const writingStyle = writingStyleOpt.value;
  const tone = toneOpt.value;
  const sentiment = sentimentOp.value;
  const max_tokens = maxTokensInp.value;
  const frequency_penalty = freqPenaltySlider.value;
  const presence_penalty = presPenaltySlider.value;
  const audience = audienceText.value;
  const format = formatOpt.value;

  let tokens;

  let prompt = "";

  // Agregar todas las variables al prompt
  for (let i = 0; i < variableNames.length; i++) {
    const name = variableNames[i].value;
    const value = variableValues[i].value;
  
    if (name && value) {
      let convertedValue;
  
      // Intentar convertir a número
      if (!isNaN(value)) {
        convertedValue = parseFloat(value);
  
        // Verificar si es un número entero
        if (Number.isInteger(convertedValue)) {
          convertedValue = parseInt(value);
        }
      }
      // Convertir a booleano si es "true" o "false"
      else if (value === "true" || value === "false") {
        convertedValue = value === "true";
      }
      // Valor por defecto: mantener como cadena de texto
      else {
        convertedValue = value;
      }
  
      let entry;
      if (typeof convertedValue === "number" || typeof convertedValue === "boolean") {
        entry = `${name} = ${convertedValue},\n`;
      } else {
        entry = `${name} = "${convertedValue}",\n`;
      }
      prompt += entry;
    }
  }

  if (context) {
    prompt += `\nContext = f"""${context}"""\n\n`;
  }
  
  if (role !== "Default") {
    prompt += `${role}\n`;
  }

  if (text !== "" && context === "") {
    prompt += `prompt = f"""${text}"""\n`;
  } else if (context !== "") {
    prompt += `prompt = f"""${text}\n\`\`\`{context}\`\`\`"""\n`;
  }
  
  if (model !== "gpt-3.5-turbo") {
    prompt += `{"model": "${model}"}, `;
  }

  if (language !== "Default") {
    prompt += `{"language": "${language}"}, `;
  }

  if (writingStyle !== "Default") {
    prompt += `{"writing style": "${writingStyle}"}, `;
  }

  if (tone !== "Default") {
    prompt += `{"tone": "${tone}"}, `;
  }

  if (sentiment !== "Default") {
    prompt += `{"sentiment": "${sentiment}"}, `;
  }

  if (format !== "Default") {
    prompt += `{"format": "${format}"}, `;
  }

  if (audience) {
    prompt += `{"audience": "${audience}"},\n`;
  }

  if (temperature > 0) {
    prompt += `{"temperature": ${temperature}}, `;
  }

  if (topP > 0) {
    prompt += `{"top_p": ${topP}}, `;
  }

  if (topK > 0) {
    prompt += `{"top_k": ${topK}}, `;
  }

  if (max_tokens > 0) {
    prompt += `{"max_tokens": ${max_tokens}}, `;
  }

  if (frequency_penalty != 0) {
    prompt += `{"frequency_penalty": ${frequency_penalty}}, `;
  }

  if (presence_penalty != 0) {
    prompt += `{"presence_penalty": ${presence_penalty}}, `;
  }
 
  outputDiv.textContent = prompt;
  copyButton.disabled = false;

  // Calcular la cuenta de caracteres y palabras
  let wordCount = 0;
  const charCount = prompt.length;

// Actualizar wordCount solo si hay un prompt no vacío
  if (prompt.trim() !== "") {
  wordCount = prompt.trim().split(/\s+/).length;
 }

   // Actualizar el contenido del elemento 'charWordCount'
  if (
    langOption.value === "Default") {
    tokens = Math.round(wordCount * 1.3);
  } else {
    tokens = Math.round(wordCount * 2.1);
  }

  charWordCount.textContent = `${charCount} chars / ${wordCount} words / ${tokens} est. tokens`;
});

//actualiza los contadores de context y text
textAreaText.addEventListener("input", updateCounters);
textAreaContext.addEventListener("input", updateCounters);

function updateCounters() {
  const textText = textAreaText.value;
  const textContext = textAreaContext.value;

  const charCountText = textText.length;
  const charCountContext = textContext.length;

  const wordCountText = textText.trim().split(/\s+/).filter(word => word.length > 0).length;
  const wordCountContext = textContext.trim().split(/\s+/).filter(word => word.length > 0).length;

  if (
    langOption.value === "Default") {
    tokensText = Math.round(wordCountText * 1.3);
  } else {
    tokensText = Math.round(wordCountText * 2.1);
  }

  if (
    langOption.value === "Default") {
    tokensContext = Math.round(wordCountContext * 1.3);
  } else {
    tokensContext = Math.round(wordCountContext * 2.1);
  }

  charWordCountText.textContent = `${charCountText} chars / ${wordCountText} words / ${tokensText} est. tokens`;
  charWordCountContext.textContent = `${charCountContext} chars / ${wordCountContext} words / ${tokensContext} est. tokens`;
}



// Boton que borra el Prompt
deletePromptButton.addEventListener("click", () => {
  outputDiv.textContent = ""; // Borrar el contenido del elemento de salida
  charWordCount.textContent = ""; //Borra el contador de char y words
  copyButton.disabled = true;
});

//agrega el valor de Temparature  al lado de la leyenda
temperatureOutput.textContent = temperatureSlider.value;

temperatureSlider.addEventListener("input", () => {
  const temperatureValue = parseFloat(temperatureSlider.value).toFixed(1);
  temperatureSlider.value = temperatureValue;
  temperatureOutput.textContent = temperatureValue;
});

//agrega el valor de Top P al lado de la leyenda
topPOutput.textContent = topPSlider.value;

topPSlider.addEventListener("input", () => {
  const topPValue = parseFloat(topPSlider.value).toFixed(2);
  topPSlider.value = topPValue;
  topPOutput.textContent = topPValue;
});

//agrega el valor de Top P al lado de la leyenda
freqyPenaltyOutput.textContent = freqPenaltySlider.value;

freqPenaltySlider.addEventListener("input", () => {
  const freqPenaltyValue = parseFloat(freqPenaltySlider.value).toFixed(1);
  freqPenaltySlider.value = freqPenaltyValue;
  freqyPenaltyOutput.textContent = freqPenaltyValue;
});

//agrega el valor de Top P al lado de la leyenda
presPenaltyOutput.textContent = presPenaltySlider.value;

presPenaltySlider.addEventListener("input", () => {
  const presPenaltyValue = parseFloat(presPenaltySlider.value).toFixed(1);
  presPenaltySlider.value = presPenaltyValue;
  presPenaltyOutput.textContent = presPenaltyValue;
});

//limita los varoes de Top K
topKInput.addEventListener("input", () => {
  const currentValue = parseInt(topKInput.value);

  // Limit to the range of 0 to 50000
  if (currentValue < 0) {
    topKInput.value = 0;
  } else if (currentValue > 10000) {
    topKInput.value = 10000;
  }
});


maxTokensInp.addEventListener("input", () => {
    const currentValue = parseInt(maxTokensInp.value);
  
    // Limit to the range of 0 to 50000
    if (currentValue < 0) {
      maxTokensInp.value = 0;
    } else if (currentValue > 1000) {
      maxTokensInp.value = 1000;
    }
  });

// Copia el prompt
copyButton.addEventListener("click", () => {
  const promptText = outputDiv.textContent;
  if (promptText) {
    navigator.clipboard
      .writeText(promptText)
      .then(() => {
        alert("Prompt copied to clipboard");
      })
      .catch((error) => {
        console.error("Error copying the prompt:", error);
      });
  }
});

// Crea una variable y la borra
let variableCounter = 0; // Contador para identificadores únicos de variables
let deleteCounter = 0

function agregarElemento() {
  variableCounter++; // Incrementar el contador
  deleteCounter++;

  // Crear un nuevo input para el nombre del elemento
  var nuevoInputName = document.createElement("input");
  nuevoInputName.setAttribute("type", "text");
  nuevoInputName.setAttribute("class", "variableName");
  nuevoInputName.setAttribute("placeholder", "Insert a name");

  // Establecer un identificador único para el input de nombre
  nuevoInputName.setAttribute("id", "variableName_" + variableCounter);

  // Crear un nuevo input para el valor del elemento
  var nuevoInputValue = document.createElement("input");
  nuevoInputValue.setAttribute("type", "text");
  nuevoInputValue.setAttribute("class", "variableValue");
  nuevoInputValue.setAttribute("placeholder", "Insert a value");

  // Establecer un identificador único para el input de valor
  nuevoInputValue.setAttribute("id", "variableValue_" + variableCounter);

  // Crear un nuevo botón de Variables de eliminar
  var nuevoBotonEliminar = document.createElement("button");

  nuevoBotonEliminar.setAttribute("type", "button");
  nuevoBotonEliminar.setAttribute("class", "deleteButton");
  
  nuevoBotonEliminar.innerHTML = "X";
  // Establecer un identificador único 
  nuevoBotonEliminar.setAttribute("id", "deleteButton_" + deleteCounter);
  nuevoBotonEliminar.onclick = function () {
    // Eliminar el inputValue al hacer clic en el botón de eliminar
    nuevoInputValue.remove();
    // Eliminar el inputName al hacer clic en el botón de eliminar
    nuevoInputName.remove();
    // Eliminar el botón de eliminar al hacer clic en el botón de eliminar
    nuevoBotonEliminar.remove();
  };

  // Obtener los contenedores donde se agregarán los elementos
  var variableNameCont = document.getElementById("variableNameCont");
  var variableValueCont = document.getElementById("variableValueCont");
  var deleteVariables = document.getElementById("deleteVariables");

  // Insertar el nuevo inputName dentro del div variableNameCont
  variableNameCont.appendChild(nuevoInputName);

  // Insertar el nuevo inputValue dentro del div variableValueCont
  variableValueCont.appendChild(nuevoInputValue);

  // Insertar el nuevo botón de eliminar después del inputValue
  deleteVariables.appendChild(nuevoBotonEliminar);
}

// Boton de definition
function moreInfo(button) {
  var texto = button.nextElementSibling;

  if (texto.style.display === "none") {
    texto.style.display = "block";
    button.innerHTML = "- Close"; // Cambia el texto del botón a "Open"
  } else {
    texto.style.display = "none";
    button.innerHTML = "+ Definition"; // Cambia el texto del botón a "Definition"
  }
}

// Busca los datos de los distintos select en los Json
fetch("assets/json/languages.json")
  .then((response) => response.json())
  .then((data) => {
    data.languagesLi.forEach((item) => {
      const option = document.createElement("option");
      option.value = item.code;
      option.text = item.name;
      langOption.appendChild(option);
    });
  });

// Busca los datos de los distintos select en los Json
fetch("assets/json/roles.json")
  .then((response) => response.json())
  .then((data) => {
    data.roleList.forEach((item) => {
      const option = document.createElement("option");
      option.value = item.code;
      option.text = item.name;
      roleOpt.appendChild(option);
    });
  });

  // Busca los datos de los distintos select en los Json
  fetch("assets/json/writingStyles.json")
  .then((response) => response.json())
  .then((data) => {
    data.writingStylesLi.forEach((item) => {
      const option = document.createElement("option");
      option.value = item.code;
      option.text = item.name;
      writingStyleOpt.appendChild(option);
    });
  });

  // Busca los datos de los distintos select en los Json
  fetch("assets/json/tones.json")
  .then((response) => response.json())
  .then((data) => {
    data.tonesList.forEach((item) => {
      const option = document.createElement("option");
      option.value = item.code;
      option.text = item.name;
      toneOpt.appendChild(option);
    });
  });

  // Busca los datos de los distintos select en los Json
  fetch("assets/json/formats.json")
  .then((response) => response.json())
  .then((data) => {
    data.formatsList.forEach((item) => {
      const option = document.createElement("option");
      option.value = item.code;
      option.text = item.name;
      formatOpt.appendChild(option);
    });
  });

// Busca los datos de los distintos select en los Json
fetch("assets/json/tasks.json")
.then((response) => response.json())
.then((data) => {
  data.tasksList.forEach((item) => {
    const option = document.createElement("option");
    option.value = item.name;
    option.text = item.name;
    taskOption.appendChild(option);
// Copiar los datos en los campos correspondientes
  taskOption.addEventListener("change", function() {
  const selectedOption = taskOption.value;
  const selectedItem = data.tasksList.find((item) => item.name === selectedOption);

  if (selectedItem) {
    // Copiar los datos en los campos correspondientes
    document.getElementById("context").value = selectedItem.context;
    document.getElementById("text").value = selectedItem.input;
    document.getElementById("model").value = selectedItem.model;
    document.getElementById("langOption").value = selectedItem.language;
    document.getElementById("roleOpt").value = selectedItem.role;
    document.getElementById("writingStyleOpt").value = selectedItem.writingStyle;
    document.getElementById("toneOpt").value = selectedItem.tone;
    document.getElementById("sentiment").value = selectedItem.sentiment;
    document.getElementById("formatOpt").value = selectedItem.format;
    document.getElementById("audience").value = selectedItem.audience;
    document.getElementById("temperature").value = selectedItem.temperature;
    document.getElementById("topP").value = selectedItem.top_p;
    document.getElementById("topK").value = selectedItem.top_k;
    document.getElementById("maxTokens").value = selectedItem.max_tokens;
    document.getElementById("frequencyPenalty").value = selectedItem.frequency_penalty;
    document.getElementById("presencePenalty").value = selectedItem.presence_penalty;
    document.getElementById("variableName_0").value = selectedItem.valname;
    document.getElementById("variableValue_0").value = selectedItem.valvalue;
  }
});
})
});

//Script para los botones que agregan Variables al context y text
 
function agregarElementos(elementID) {
  var valores = document.getElementsByClassName('variableName');
  var menuDesplegable = document.getElementById('menuDesplegable');
  if (elementID === 'text') {
      menuDesplegable = document.getElementById('menuDesplegableText');
  }

  // Limpiar el menú desplegable antes de agregar nuevos elementos
  menuDesplegable.innerHTML = '';

  for (var i = 0; i < valores.length; i++) {
      var valor = valores[i].value;
      if (valor.trim() !== '') {
          var elementoLi = document.createElement('li');
          elementoLi.classList.add('addVariable');
          elementoLi.textContent = valor;
          elementoLi.addEventListener('mouseover', function () {
              // Resaltar el elemento al pasar el cursor sobre él
              this.classList.add('seleccionado');
          });
          elementoLi.addEventListener('mouseout', function () {
              // Eliminar el resaltado cuando el cursor sale del elemento
              this.classList.remove('seleccionado');
          });
          
          elementoLi.addEventListener('click', function () {
            var valorSeleccionado = this.textContent;
            var cursorPosicion = document.getElementById(elementID).selectionStart;
            var textoAnterior = document.getElementById(elementID).value.substring(0, cursorPosicion);
            var textoPosterior = document.getElementById(elementID).value.substring(cursorPosicion);
            document.getElementById(elementID).value = textoAnterior + ' {' + valorSeleccionado + '} ' + textoPosterior;
        });

          menuDesplegable.appendChild(elementoLi);
      }
  }

  // Enfocar el menú desplegable
  menuDesplegable.focus();
}

function navegarMenu(event) {
  var menuDesplegable = document.getElementById('menuDesplegable');
  var elementosLi = menuDesplegable.getElementsByTagName('li');
  var indiceSeleccionado = Array.from(elementosLi).findIndex(el => el.classList.contains('seleccionado'));

  if (indiceSeleccionado === -1) {
      // Si no hay ningún elemento seleccionado, seleccionar el primero
      elementosLi[0].classList.add('seleccionado');
  } else {
      // Desmarcar el elemento actualmente seleccionado
      elementosLi[indiceSeleccionado].classList.remove('seleccionado');
  }

  if (event.key === 'ArrowDown') {
      indiceSeleccionado = (indiceSeleccionado + 1) % elementosLi.length;
  } else if (event.key === 'ArrowUp') {
      indiceSeleccionado = (indiceSeleccionado - 1 + elementosLi.length) % elementosLi.length;
  } else {
      // Agregar este caso para seleccionar el primer elemento si no hay ningún elemento seleccionado
      if (elementosLi.length > 0) {
          indiceSeleccionado = 0;
      }
  }

  elementosLi[indiceSeleccionado].classList.add('seleccionado');
}

// Asegúrate de que los elementos con la clase 'popupHidden' estén ocultos inicialmente
document.querySelectorAll('.popupHidden').forEach(function (popup) {
  popup.classList.add('hidden');
});
  
document.addEventListener('click', function (event) {
  var target = event.target;
  var popups = document.querySelectorAll('.popupHidden');
  
  popups.forEach(function (popup) {
  if (!target.classList.contains('labelWithPopup')) {
  popup.classList.add('hidden');
  }
  });
});
  
document.addEventListener('touchstart', function (event) {
  var target = event.target;
  var popups = document.querySelectorAll('.popupHidden');
  
  popups.forEach(function (popup) {
  if (!target.classList.contains('labelWithPopup')) {
  popup.classList.add('hidden');
  }
  });
  });
  
  document.querySelectorAll('.labelWithPopup').forEach(function (label) {
  function toggleHidden(event) {
    if (event.cancelable) event.preventDefault();
    this.nextElementSibling.classList.toggle('hidden');
  }
  
  label.addEventListener('click', toggleHidden);
  label.addEventListener('touchstart', toggleHidden);
  label.addEventListener('mouseover', function () {
  this.nextElementSibling.classList.remove('hidden');
  });
  label.addEventListener('mouseout', function () {
  this.nextElementSibling.classList.add('hidden');
  });
  });
 