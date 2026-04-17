# 2. Implementación estructural de la pantalla

Separé la lógica de la vista mediante un Custom Hook (useAudioRecorderHook), centralizando allí el manejo del SDK de Expo Audio.

El listado se genera dinámicamente mapeando el estado recordings, asignando a cada RecordingItem funciones para controlar su propia reproducción y borrado.

esta es la captura de pantalla de la estructura de carpetas

1. [Implementación estructural de la pantalla](../assets/aplicacion-capturas/estructura.png)
