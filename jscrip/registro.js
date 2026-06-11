document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. Configurar Fecha Máxima Nativa ---
    // Calculamos la fecha máxima permitida (hace exactamente 12 años)
    const today = new Date();
    const maxDateObj = new Date(today.setFullYear(today.getFullYear() - 12));
    const year = maxDateObj.getFullYear();
    const month = String(maxDateObj.getMonth() + 1).padStart(2, '0');
    const day = String(maxDateObj.getDate()).padStart(2, '0');
    
    document.getElementById('nacimiento').setAttribute('max', `${year}-${month}-${day}`);

    // --- 2. Elementos del Formulario ---
    const form = document.getElementById('form-registro');
    const inputs = {
        nombre: document.getElementById('nombre'),
        username: document.getElementById('username'),
        email: document.getElementById('email'),
        nacimiento: document.getElementById('nacimiento'),
        password: document.getElementById('password'),
        confirm_password: document.getElementById('confirm_password')
    };

    // --- 3. Expresiones Regulares ---
    const regex = {
        username: /^[a-zA-Z0-9_]{4,}$/,
        email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        password: /^(?=.*[A-Z])(?=.*\d).{8,}$/
    };

    // --- 4. Mensajes de Error ---
    const mensajes = {
        nombre: "El nombre es obligatorio.",
        username: "Mínimo 4 caracteres (letras, números o guion bajo).",
        email: "Ingresá un correo electrónico válido (ej: usuario@dominio.com).",
        nacimiento: "Debes ser mayor de 12 años para registrarte.",
        password: "Mínimo 8 caracteres, al menos 1 mayúscula y 1 número.",
        confirm_password: "Las contraseñas no coinciden."
    };

    // --- 5. Funciones de Validación ---
    
    // Función auxiliar para mostrar/ocultar error
    const toggleError = (input, isValid, mensajeError = "") => {
        // Encontrar el contenedor más cercano que tenga el mensaje de error
        const grupo = input.closest('.grupo-input');
        const spanError = grupo.querySelector('.error-message');
        
        if (!isValid) {
            input.classList.add('input-error');
            spanError.textContent = mensajeError;
            spanError.classList.add('visible');
        } else {
            input.classList.remove('input-error');
            spanError.classList.remove('visible');
            setTimeout(() => { 
                if(!spanError.classList.contains('visible')) spanError.textContent = ""; 
            }, 300); // Esperar a que termine la animación
        }
    };

    // Funciones específicas por campo
    const validarCampo = {
        nombre: () => {
            const val = inputs.nombre.value.trim();
            const isValid = val.length > 0;
            toggleError(inputs.nombre, isValid, mensajes.nombre);
            return isValid;
        },
        username: () => {
            const isValid = regex.username.test(inputs.username.value);
            toggleError(inputs.username, isValid, mensajes.username);
            return isValid;
        },
        email: () => {
            const isValid = regex.email.test(inputs.email.value);
            toggleError(inputs.email, isValid, mensajes.email);
            return isValid;
        },
        nacimiento: () => {
            const isValid = inputs.nacimiento.value !== "";
            toggleError(inputs.nacimiento, isValid, mensajes.nacimiento);
            return isValid;
        },
        password: () => {
            const isValid = regex.password.test(inputs.password.value);
            toggleError(inputs.password, isValid, mensajes.password);
            
            // Si el confirm_password ya tiene algo, revalidarlo para que coincida
            if(inputs.confirm_password.value.length > 0) {
                validarCampo.confirm_password();
            }
            return isValid;
        },
        confirm_password: () => {
            const val1 = inputs.password.value;
            const val2 = inputs.confirm_password.value;
            const isValid = val2.length > 0 && val1 === val2;
            toggleError(inputs.confirm_password, isValid, mensajes.confirm_password);
            return isValid;
        }
    };

    // --- 6. Listeners para Validación en Tiempo Real (Blur e Input) ---
    Object.keys(inputs).forEach(key => {
        const input = inputs[key];
        
        // Al salir del input (Blur) - validación estricta
        input.addEventListener('blur', () => {
            validarCampo[key]();
        });

        // Mientras escribe (Input) - limpiar error rápido si se arregló
        input.addEventListener('input', () => {
            if (input.classList.contains('input-error')) {
                validarCampo[key]();
            }
        });
    });

    // --- 7. Toggle Password Visibility (El ojito) ---
    const toggleButtons = document.querySelectorAll('.toggle-password');
    toggleButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // El input hermano
            const input = btn.previousElementSibling;
            const iconEye = btn.querySelector('.icon-eye');
            const iconEyeOff = btn.querySelector('.icon-eye-off');
            
            if (input.type === 'password') {
                input.type = 'text';
                iconEye.style.display = 'none';
                iconEyeOff.style.display = 'block';
            } else {
                input.type = 'password';
                iconEye.style.display = 'block';
                iconEyeOff.style.display = 'none';
            }
        });
    });

    // --- 8. Envío del Formulario ---
    form.addEventListener('submit', (e) => {
        e.preventDefault(); // Detener envío para validar primero
        
        let formIsValid = true;
        
        // Ejecutar todas las validaciones
        Object.keys(validarCampo).forEach(key => {
            const isValid = validarCampo[key]();
            if (!isValid) formIsValid = false;
        });

        if (formIsValid) {
            // Si todo está bien, simulamos el envío o enviamos de verdad
            console.log("Formulario válido. Enviando datos...");
            const btn = form.querySelector('.btn-submit');
            btn.textContent = "¡Registrado!";
            btn.style.backgroundColor = "#10b981"; // Verde éxito
            
            // Opcional: form.submit(); // Si quieres que recargue
            setTimeout(() => {
                window.location.href = "index.html";
            }, 1500);
        } else {
            console.log("Hay errores en el formulario.");
            // Hacer foco en el primer input con error para mejorar UX
            const primerError = form.querySelector('.input-error');
            if (primerError) primerError.focus();
        }
    });
});
