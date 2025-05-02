create table Vaccination
(
    clientID  int         not null,
    name      varchar(32) not null,
    dateTaken date        not null,
    primary key (clientID, name, dateTaken),
    constraint vaccination_Client_clientID_fk
        foreign key (clientID) references Client (clientID)
);


