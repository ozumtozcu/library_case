db.createUser(
    {
        user: "ozum",
        pwd: "Asd.1234",
        roles: [
            {
                role: "readWrite",
                db: "library"
            }
        ]
    }
);

