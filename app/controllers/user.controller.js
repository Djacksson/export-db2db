const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient()

class UserController {
    async InsertData(data) {
        try {
            return await prisma.user.create({ data: data })
        } catch (error) {
            console.error('Erreur to insert ActiviteProjet :', error);
        }
    };

    async UpdateData(data) {
        try {
            return await prisma.user.update({ where: { id: data.id }, data: data });
        } catch (error) {
            console.error('Erreur to update ActiviteProjet :', error);
            throw error;
        }
    };

    async GetAllData() {
        try {
            return await prisma.user.findMany({ include: { clusters: true } })
        } catch (error) {
            console.error('Erreur to get ActiviteProjet :', error);
            throw error;
        }
    }

    async DeleteData(dataID) {
        try {
            return await prisma.user.delete({ where: { id: dataID } })
        } catch (error) {
            console.error('Erreur to delete ActiviteProjet :', error);
            throw error;
        }
    };

    async GetDataById(dataID) {
        try {
            return await prisma.user.findUnique({ where: { id: dataID }, include: { clusters: true } })
        } catch (error) {
            console.error('Erreur to get ActiviteProjet by Id:', error);
            throw error;
        }
    };

    async GetDataByLogin(dataLogin) {
        try {
            return await prisma.user.findFirst({ where: { login: dataLogin }, include: { clusters: true } })
        } catch (error) {
            console.error('Erreur to get ActiviteProjet by Name:', error);
            throw error;
        }
    };

    async GetDataByEmail(dataEmail) {
        try {
            return await prisma.user.findFirst({ where: { email: dataEmail }, include: { clusters: true } })
        } catch (error) {
            console.error('Erreur to get ActiviteProjet by Email:', error);
            throw error;
        }
    };
}

module.exports = UserController;