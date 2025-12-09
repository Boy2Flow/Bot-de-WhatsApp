# 🛡️ Sistema de Inmunidad y Usuarios Privilegiados

Se ha implementado un sistema robusto de privilegios e inmunidad para el bot. Este sistema asegura que el dueño del bot, el propio bot y otros usuarios designados tengan control total y protección contra acciones administrativas.

## 👥 Usuarios Privilegiados (Super Admins)

Los usuarios definidos en `config/privilegedUsers.js` tienen el estatus de "Super Admin".

**Lista actual:**

1. Bot Owner: `34608837414`
2. Bot ID: (Automático al iniciar)
3. Usuario extra 1: `144268589035668`
4. Usuario extra 2: `112902442897512`

## 👑 Privilegios

Los Super Admins tienen los siguientes poderes:

1.  **Acceso Total:** Pueden usar **todos** los comandos del bot, incluidos los comandos marcados como `adminOnly` (solo administradores), incluso si no son administradores del grupo en WhatsApp.
2.  **Control del Sistema:** Acceso exclusivo a comandos de sistema como `.stop`, `.start`, `.reload` y `.mantenimiento`.
3.  **Gestión de Privilegios:** El dueño del bot puede añadir o quitar otros Super Admins con `.addsuperadmin` y `.removesuperadmin`.

## 🛡️ Inmunidades

Los Super Admins están protegidos contra **cualquier** acción negativa, ya sea por parte de otros administradores del grupo o por el propio bot.

### Protecciones Específicas:

- **🚫 Anti-Kick:** El comando `.kick` (expulsar) mostrará un error si se intenta usar contra un Super Admin.
- **🔇 Anti-Mute:**
  - El comando `.mute` no funcionará contra ellos.
  - Incluso si (hipotéticamente) estuvieran en la base de datos de muteados, la función `isUserMuted` siempre devolverá `false`, por lo que sus mensajes nunca serán borrados automáticamente.
- **⚠️ Anti-Warn:** El comando `.warn` (advertencia) está bloqueado contra ellos. No pueden acumular advertencias ni ser expulsados automáticamente por ellas.
- **⬇️ Anti-Demote:** El comando `.demote` (quitar admin) no funcionará contra ellos.
- **🤡 Anti-Troll:** El comando `.troll` (spam) no se puede ejecutar contra ellos.
- **🛡️ Protección General:** En el núcleo del manejador de mensajes (`handleMessage`), hay una verificación global que impide que cualquier comando `adminOnly` dirigido a un usuario (vía mención) surta efecto si el objetivo es un Super Admin y el remitente no lo es.

## 📝 Nuevos Comandos

| Comando                   | Alias          | Descripción                                           | Permiso    |
| :------------------------ | :------------- | :---------------------------------------------------- | :--------- |
| `.superadmins`            | `.listsuper`   | Muestra la lista de todos los usuarios con inmunidad. | Todos      |
| `.addsuperadmin @user`    | `.addsuper`    | Añade un nuevo Super Admin.                           | Solo Dueño |
| `.removesuperadmin @user` | `.removesuper` | Elimina un Super Admin.                               | Solo Dueño |

## ✅ Verificación

Para verificar que el sistema funciona:

1.  **Prueba de Mute:** Intenta usar `.mute @bot` o `.mute @tu_usuario`. Debería responder: "👑 No puedes mutear a @usuario...".
2.  **Prueba de Kick:** Intenta `.kick @tu_usuario` (desde otro admin) o `.kick @bot`. Debería dar el mismo error de inmunidad.
3.  **Lista:** Usa `.superadmins` para ver que los IDs configurados aparecen correctamente.
