BASE DE DATOS:

Si se quiere correr al cien el proyecto se deberá hacer una base de datos en postgresql.
En el archivo "Tablas ToDoAct.txt" se encuentran los queries para crear las tablas y filas requeridas.
En el archivo "server.js", en el const client (línea 22) deberán poner los datos de su bd creada para que el proyecto pueda apuntar a ella.

ARRANQUE:

Abriendo el proyecto en el VS Code, desde la terminal escriben:
    node server.js
Si no se tiene node en la misma terminal deberá ofrecer instalarlo, o bien se tendrá que instalar por fuera.

Ya que marque la conexión exitosa a la base de datos, desde el navegador podrán acceder al sistema de manera local con:
    http://localhost:8080/index.html
O bien, si ya se necesita centralizar un equipo para que se esté usando el sistema, puede usarse la ip que se tenga actualmente (Esto lo averiguan con un ipconfig desde el cmd):
    http://{ipv4 que salió del ipconfig}:8080/index.html
Esto último permitirá que varios usuarios puedan usar el sistema desde sus navegadores web sin necesidad de tener el proyecto, y apuntando a un equipo centralizado el cual está corriendo el proyecto con una misma base de datos.