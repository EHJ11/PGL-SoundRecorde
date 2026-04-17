# 1. Diseño de la Pantalla

Decidí crear una pantalla con el fondo negro, teniendo el boton de grabar y cuanto esta durando la grabación en la parte de arriba de la pantalla.

En la parte del medio de la pantalla se puede ver las grabaciones que hay y si no hay se muestra un texto que pone
que todavñia no hay grabaciones

Como puede ver si le hace click en este enlace lleva directo a la aplicación

1. [Diseño de la Pantalla](../assets/aplicacion-capturas/PantallaInicio.png)

# Implementé:

Un botón de grabación y diseñé un componente personalizado que cambia visualmente según el estado de la app.
Cree una lógica de formateo para convertir los milisegundos en segundos y minutos

Utilizé una estructura de mapeo sobre el array de grabaciones para renderizar cada RecordingItem de forma dinámica.
