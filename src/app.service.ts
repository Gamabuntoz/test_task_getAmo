import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class AppService {
  constructor(private readonly httpService: HttpService) {}

  async getСontacts(name: string, email: string, phone: string) {
    const accessToken =
      'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6IjM4MWEwNThhZjAwMjJkOTE2M2M4ZGI2MDRiZGRjNjEyY2FmYTA4ZTYzMDFmYjViM2RmZDYxZDFlMzY0YzI3YWM4MWY5OWE0MmU2ZWVkYTlmIn0.eyJhdWQiOiI4YmY5ZjE1ZS1iNWM5LTRiZmQtOWY2Ni1iZmI3MTc0YTYxMmEiLCJqdGkiOiIzODFhMDU4YWYwMDIyZDkxNjNjOGRiNjA0YmRkYzYxMmNhZmEwOGU2MzAxZmI1YjNkZmQ2MWQxZTM2NGMyN2FjODFmOTlhNDJlNmVlZGE5ZiIsImlhdCI6MTY5NDAwMzE0NywibmJmIjoxNjk0MDAzMTQ3LCJleHAiOjE2OTQwODk1NDcsInN1YiI6IjEwMDQ3MjYyIiwiZ3JhbnRfdHlwZSI6IiIsImFjY291bnRfaWQiOjMxMjc5MDY2LCJiYXNlX2RvbWFpbiI6ImFtb2NybS5ydSIsInZlcnNpb24iOiJ2MiIsInNjb3BlcyI6WyJwdXNoX25vdGlmaWNhdGlvbnMiLCJmaWxlcyIsImNybSIsImZpbGVzX2RlbGV0ZSIsIm5vdGlmaWNhdGlvbnMiXX0.cDJm2rehTm4XI71gpNdNqLoLQ-oayMTi9CNhsyTYcFfZTAqMVivvVeMmMDkhgENdq7u6IFR87FUgwNUW9pGobV0QlHmYuYVMUMsETDGFkHTJrWHjJlOPFD_7bxxy8qBfAHslIp4_SXbMu7DAk089x2UG1bVnayQIqElIcHwUoDeTiGlRYQTlGVk9fRb5UCvkLjxTEBth4oAjYFzxXIU73aG7c9kf02FcoiK9vvQbGJEafHaVreohF0vjkoJlWl6DX6La7XZHphbg2Tly3gUYizycio8v__ihiPiIn2PunW93BNNBXxoi_inIz3K1lv-nJGU-6j4BsPOID4VPBqvuNA';
    let result = await this.httpService
      .get(`https://bonyfroze.amocrm.ru/api/v4/contacts?query=${phone}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .toPromise()
      .then((res) => (res.data ? res.data._embedded.contacts : null));

    if (!result) {
      result = await this.httpService
        .get(`https://bonyfroze.amocrm.ru/api/v4/contacts?query=${email}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
        .toPromise()
        .then((res) => (res.data ? res.data._embedded.contacts : null));
    }

    if (result) {
      const updateData = await this.updateJSON(
        result[0].id,
        name,
        email,
        phone,
      );
      await this.httpService
        .patch(
          `https://bonyfroze.amocrm.ru/api/v4/contacts/${result[0].id}`,
          updateData,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          },
        )
        .toPromise()
        .then((res) => (res.data ? res.data : null));
    } else {
      const createData = await this.createJSON(name, email, phone);
      await this.httpService
        .post(`https://bonyfroze.amocrm.ru/api/v4/contacts`, createData, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
        .toPromise()
        .then((res) => (res.data ? res.data : null));
    }

    const createLeadData = await this.createLeadJSON(result[0].id);
    const creatLead = await this.httpService
      .post(`https://bonyfroze.amocrm.ru/api/v4/leads`, createLeadData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .toPromise()
      .then((res) => (res.data ? res.data : null));
    return creatLead;
  }

  async updateJSON(id: number, name: string, email: string, phone: string) {
    return JSON.stringify({
      id: id,
      name: name,
      custom_fields_values: [
        {
          field_id: 1469603,
          field_name: 'Телефон',
          values: [
            {
              value: phone,
              enum_code: 'WORK',
            },
          ],
        },
        {
          field_id: 1469605,
          field_name: 'Email',
          values: [
            {
              value: email,
              enum_code: 'WORK',
            },
          ],
        },
      ],
    });
  }

  async createJSON(name: string, email: string, phone: string) {
    return JSON.stringify([
      {
        name: name,
        custom_fields_values: [
          {
            field_id: 1469603,
            field_name: 'Телефон',
            values: [
              {
                value: phone,
              },
            ],
          },
          {
            field_id: 1469605,
            field_name: 'Email',
            values: [
              {
                value: email,
              },
            ],
          },
        ],
      },
    ]);
  }

  async createLeadJSON(id: number) {
    return JSON.stringify([
      {
        name: 'Сделка для примера 1',
        created_by: 0,
        price: 20000,
        _embedded: {
          contacts: [
            {
              id: id,
            },
          ],
        },
      },
    ]);
  }
}
