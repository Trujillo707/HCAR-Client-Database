/**
 * This module contains the server-side logic that gets report data ready to send to the client so broswer can
 * generate the pdf report.
 * @module reports
 * @author Orlando Trujillo-Ortiz
 * @version 2025-05-05
 */

import QueryParserBuilder from "../objects/QueryParserBuilder.js";

/**
 * Get the mailing list (that an Account can see) and send the data to the browser.
 * @param account
 * @param req
 * @param res
 */
export async function mailListReport(account, req, res) {
    const qp = await new QueryParserBuilder().build();
    try {
        const data = await qp.getMailingList(account);
        res.json(data);
    } catch (e) {
        res.status(500).json({error: "Failed to get data"});
    }
}

export async function expPurchaseInMonthReport(account, req, res) {
    const qp = await new QueryParserBuilder().build();
    try {
        const data = await qp.getexpPurchaseInMonth(account);
        for (const client of data){
            client.dateOfBirth = client.dateOfBirth.toLocaleDateString("en-US", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit"
            });
            client.pos = (client.pos == null) ? "Not on File" : client.pos.toLocaleDateString("en-US", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit"
            });
            if (client.daysRemaining == null){
                client.daysRemaining = "Not on File";
            } else if (client.daysRemaining === 0){
                client.daysRemaining = "Expires Today";
            } else if (client.daysRemaining < 0) {
                client.daysRemaining = Math.abs(client.daysRemaining) + " days expired";
            } else {
                client.daysRemaining = client.daysRemaining + " days remaining";
            }
        }
        res.json(data);
    } catch (e) {
        console.log("posExpReport failed: " + e);
        res.status(500).json({error: "Failed to get data"});
    }
}

export async function listAllClientsReport(account, req, res) {
    const qp = await new QueryParserBuilder().build();
    try {
        const data = await qp.getSimpleClientList(account);
        for (const client of data){
            client.dateOfBirth = client.dateOfBirth.toLocaleDateString("en-US", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit"
            });
        }
        res.json(data);
    } catch (e) {
        res.status(500).json({error: "Failed to get data"});
    }
}

export async function medInfoReport(clientID, req, res){
    const qp = await new QueryParserBuilder().build();
    try {
        let data = {};
        let [client, preferences, vaccinations, medications ] = await Promise.all([
            qp.getSimpleClientBio(clientID),
            qp.getInsuranceAndMedicalPreferences(clientID),
            qp.getVaccinationList(clientID),
            qp.getMedicationList(clientID)
        ]).catch(
            (e) => {
                console.log("medInfoReport failed: " + e);
                res.status(500).json({error: "Failed to get data"});
            }
        );
        client.dateOfBirth = client.dateOfBirth instanceof Date ? client.dateOfBirth.toLocaleDateString("en-US", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit"
        }) : "Unknown";
        data.client = client;
        data.preferences = preferences;
        for (const vaccination of vaccinations){
            vaccination.dateTaken = vaccination.dateTaken instanceof Date ? vaccination.dateTaken.toLocaleDateString("en-US", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit"
            }) : "Unknown";
        }
        data.vaccinations = vaccinations;
        for (const medication of medications){
            medication.prn = medication.prn ? "Yes" : "No";
        }
        data.medications = medications;

        res.json(data);
    } catch (e) {
        console.log("medInfoReport failed: " + e);
        res.status(500).json({error: "Failed to query all medical"});
    }
}

export async function caseNotePDFData(noteID, req, res){
    const qp = await new QueryParserBuilder().build();
    try {
        const data = await qp.getCaseNote(noteID);
        if (data.Error) {
            throw new Error(data.Error);
        }

        data.dateCreated = data.dateCreated instanceof Date ? data.dateCreated.toLocaleDateString("en-US", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit"
            }) : "Unknown";

        if (data.dateModified == null){
            data.dateModified = "Not Modified";
        } else if (data.dateModified instanceof Date) {
            data.dateModified = data.dateModified.toLocaleDateString("en-US", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit"
            });
        } else {
            data.dateModified = "Unknown";
        }

        data.dateOfEvent = data.dateOfEvent instanceof Date ? data.dateOfEvent.toLocaleDateString("en-US", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit"
            }) : "Unknown";
        res.json(data);
    } catch (e) {
        console.log("getCaseNotePDF failed: " + e);
        res.status(500).json({error: "Failed to get case note data"});
    }
}

