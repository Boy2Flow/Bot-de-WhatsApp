// Configuración de usuarios privilegiados del bot
export const config = {
    // Número del bot (obtener automáticamente)
    botNumber: null, // Se establece automáticamente al iniciar
    
    // Usuarios con privilegios totales (SUPER ADMINS)
    superAdmins: [
        '34608837414@s.whatsapp.net', // Tu número
        '34613762515@s.whatsapp.net',
        '112902442897512@s.whatsapp.net',
        '97852307026020@s.whatsapp.net' // Dueño del bot
    ],


    
    // Verificar si un usuario es super admin
    isSuperAdmin: function(userId) {
        if (!userId) return false;
        
        // Normalizar el ID (quitar prefijos/sufijos que no sean números si es necesario, pero mantener @s.whatsapp.net)
        // A veces userId viene como '123456:5@s.whatsapp.net'
        
        const cleanId = userId.split('@')[0].split(':')[0]; // Obtener solo el número
        const fullId = `${cleanId}@s.whatsapp.net`;
        
        // Debug
        // console.log(`[AUTH] Checking: ${userId} -> Clean: ${cleanId} -> Full: ${fullId}`);
        // console.log(`[AUTH] SuperAdmins: ${JSON.stringify(this.superAdmins)}`);

        // Verificar si es el bot
        if (this.botNumber) {
            const botClean = this.botNumber.split('@')[0].split(':')[0];
            if (cleanId === botClean) return true;
        }
        
        // Verificar si está en la lista de super admins
        // Comparamos solo los números para evitar problemas de formato
        const isSuper = this.superAdmins.some(admin => {
            const adminClean = admin.split('@')[0].split(':')[0];
            return adminClean === cleanId;
        });
        
        return isSuper;
    },
    
    // Establecer el número del bot
    setBotNumber: function(number) {
        this.botNumber = number;
        console.log(`🤖 Bot number establecido: ${number}`);
    },
    
    // Añadir un super admin
    addSuperAdmin: function(userId) {
        const normalizedId = userId.includes('@') ? userId : `${userId}@s.whatsapp.net`;
        if (!this.superAdmins.includes(normalizedId)) {
            this.superAdmins.push(normalizedId);
            console.log(`👑 Super admin añadido: ${normalizedId}`);
            return true;
        }
        return false;
    },
    
    // Remover un super admin
    removeSuperAdmin: function(userId) {
        const normalizedId = userId.includes('@') ? userId : `${userId}@s.whatsapp.net`;
        const index = this.superAdmins.indexOf(normalizedId);
        if (index > -1) {
            this.superAdmins.splice(index, 1);
            console.log(`👑 Super admin removido: ${normalizedId}`);
            return true;
        }
        return false;
    },
    
    // Listar super admins
    listSuperAdmins: function() {
        return [...this.superAdmins];
    }
};
