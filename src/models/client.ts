import prisma from './prisma';
import { ClientDTO } from '../interfaces/clients';

/**
 * Create new client, and save it into database
 * @param client 
 */
async function createClient(client: ClientDTO) {

    // Save preset in database
    const newClient = await prisma.client.create({
        data: {
            name: client.name,
            ip: client.ip
        }
    });
}

async function updateClient(clientId: number, client: ClientDTO) {
    // Update client in database
    const clientUpd = await prisma.client.update(
        {
            where: {
                id: clientId
            },
            data: {
                name: client.name,
                ip: client.ip
            }
        });
}

/**
 * Функция для поиска клиента по IP
 * @param {string} ipAddress - IP-адрес клиента
 * @returns {Promise<Object|null>} - Информация о клиенте или null, если клиент не найден
 */
async function getClientByIp(ipAddress: string) {
    try {
      // Поиск клиента по IP
      const client = await prisma.client.findFirst({
        where: {
          ip: ipAddress,
        },
      });
  
      if (!client) {
        console.log(`Клиент с IP ${ipAddress} не найден.`);
        return null;
      }

      console.log(client);
      // Возвращаем информацию о клиенте
      return {
        id: client.id,
        ip: client.ip,
        name: client.name,
      };
    } catch (error) {
      console.error('Ошибка при поиске клиента:', error);
      throw error;
    } finally {
      await prisma.$disconnect();
    }
  }

 export {getClientByIp, updateClient, createClient}