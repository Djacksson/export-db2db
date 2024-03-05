

class UserController {
    async InsertData(data) {
        try {
            return await db('t_users').insert(data)
        } catch (error) {
            console.error('Erreur to insert ActiviteProjet :', error);
        }
    };

    async UpdateData(data) {
        try {
            return await db('t_users')
                .where('id', data.id)
                .update(data)
        } catch (error) {
            console.error('Erreur to update ActiviteProjet :', error);
            throw error;
        }
    };

    async GetAllData() {
        try {
            return await db('t_users').select('*');
        } catch (error) {
            console.error('Erreur to get ActiviteProjet :', error);
            throw error;
        }
    }
    async DeleteData(dataID) {
        try {
            return await db('t_users').where('id', dataID).del();
        } catch (error) {
            console.error('Erreur to delete ActiviteProjet :', error);
            throw error;
        }
    };
    async GetDataById(dataID) {
        try {
            return await db('t_users').where('id', dataID);
        } catch (error) {
            console.error('Erreur to get ActiviteProjet by Id:', error);
            throw error;
        }
    };

    async GetDataByEmail(dataEmail) {
        try {
            return await db('t_users').where('email', dataEmail);
        } catch (error) {
            console.error('Erreur to get ActiviteProjet by Email:', error);
            throw error;
        }
    };
}

module.exports = UserController;