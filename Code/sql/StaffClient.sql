create table StaffClient
(
    staffID      int         null,
    clientID     int         null,
    title        varchar(64) null,
    dateAssigned date        null,
    dateRemoved  date        null,
    constraint fk_staffClient_client
        foreign key (clientID) references Client (clientID),
    constraint fk_staffClient_staff
        foreign key (staffID) references Staff (staffID)
);


