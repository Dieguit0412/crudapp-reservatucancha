# Gestión de Reservas de Canchas Deportivas

## Descripción

Esta aplicación web permite a los usuarios gestionar reservas de canchas deportivas de manera eficiente, utilizando tecnologías modernas tanto en el frontend como en el backend. El backend está desarrollado con Node.js y Express, documentado con Swagger para facilitar la comprensión de la API REST. El frontend está construido con ReactJS, haciendo uso de Hooks, Context API, y manejo de rutas con React Router. Las peticiones HTTP se realizan mediante Axios.

## Tecnologías utilizadas

- **Backend:** Node.js, Express, Swagger (Documentación API REST)  
- **Frontend:** ReactJS, Hooks (useState, useContext, useEffect, useReducer), Context API, React Router, Axios  
- **Control de versiones:** Git y GitHub  

---

## Instalación

### Backend

1. Accede a la carpeta backend:

```bash
cd backend
Instala las dependencias:

bash
Copiar
Editar
npm install
Inicia el servidor:

bash
Copiar
Editar
node server.js
El backend estará activo en: http://localhost:3000

La documentación Swagger estará disponible en: http://localhost:3000/api-docs

Frontend
Accede a la carpeta frontend:

bash
Copiar
Editar
cd ../frontend
Instala las dependencias:

bash
Copiar
Editar
npm install
Ejecuta la aplicación:

bash
Copiar
Editar
npm run dev
La aplicación estará corriendo en: http://localhost:5173 (o el puerto que indique el terminal)

Funcionalidades principales
Registro, consulta y gestión de reservas para canchas deportivas.

Navegación fluida y dinámica entre diferentes vistas mediante React Router.

Gestión global del estado con Context API y useReducer para optimizar la performance.

Comunicación con el backend usando Axios para realizar peticiones HTTP seguras y eficientes.

Documentación clara y accesible del API REST mediante Swagger, para facilitar su comprensión y uso.

Uso
Accede al frontend para realizar y gestionar reservas.

Consulta la documentación Swagger para conocer las rutas y métodos disponibles en la API.

Contribuciones
Las contribuciones para mejorar este proyecto son bienvenidas. Por favor, abre un issue o un pull request con tus sugerencias o correcciones.

Licencia
Este proyecto está licenciado bajo la Licencia MIT. Consulta el archivo LICENSE para más detalles.
