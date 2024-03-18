const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient()

class UserController {
    async InsertData(data) {
        try {
            return await prisma.cluster.create({ data: data })
        } catch (error) {
            console.error('Erreur to insert cluster :', error);
        }
    };

    async UpdateData(data) {
        try {
            return await prisma.cluster.update({ where: { id: data.id }, data: data });
        } catch (error) {
            console.error('Erreur to update cluster :', error);
            throw error;
        }
    };

    async GetAllData() {
        try {
            return await prisma.cluster.findMany()
        } catch (error) {
            console.error('Erreur to get cluster :', error);
            throw error;
        }
    }

    async DeleteData(dataID) {
        try {
            return await prisma.cluster.delete({ where: { id: dataID } })
        } catch (error) {
            console.error('Erreur to delete cluster :', error);
            throw error;
        }
    };

    async GetDataById(dataID) {
        try {
            return await prisma.cluster.findUnique({ where: { id: dataID }, })
        } catch (error) {
            console.error('Erreur to get cluster by Id:', error);
            throw error;
        }
    };

    async GetDataByUser(dataUser) {
        try {
            return await prisma.cluster.findMany({ where: { userId: dataUser }, })
        } catch (error) {
            console.error('Erreur to get AsctiviteProjet by User:', error);
            throw error;
        }
    };

    //####################################################################
    //####################################################################
    async InsertRequest(data) {
        try {
            return await prisma.request_Register.create({ data: data })
        } catch (error) {
            console.error('Erreur to insert cluster request :', error);
        }
    };

}

module.exports = UserController;