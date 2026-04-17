# 3. Gestión de permisos

    La aplicación verifica el estado del permiso antes de iniciar cualquier grabación mediante requestRecordingPermissionsAsync().

    Si el usuario deniega el permiso, se detiene el flujo y se muestra una Alert informativa, cumpliendo con el requisito de solicitarlo siempre antes de grabar.


    el codigo se encuentra en:

[](../hooks/useAudioRecorder.ts)
