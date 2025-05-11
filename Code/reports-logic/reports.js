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

