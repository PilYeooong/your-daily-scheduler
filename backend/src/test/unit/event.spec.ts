import { Request, Response } from 'express';
import { type } from 'os';
import typeorm = require('typeorm');
import {
  addEvent,
  loadEvent,
  loadEvents,
  loadEventsWithTime,
} from '../../controllers/event';
import Event from '../../entity/Event';
import Schedule from '../../entity/Schedule';
import User from '../../entity/User';
import { IEvent } from '../../interfaces';

const mockRequest = (body?: Object, query?: Object): Request => {
  const req = {
    decoded: {
      id: 1,
    },
    body,
    query,
  } as unknown;

  return req as Request;
};

const mockResponse = (): Response => {
  const res = {
    status: jest.fn().mockReturnThis(),
    send: jest.fn(),
    json: jest.fn(),
  } as unknown;

  return res as Response;
};

const req = mockRequest();
const res = mockResponse();
const next = jest.fn();

afterEach(() => {
  jest.clearAllMocks();
});

describe('loadEvents', () => {
  const MOCK_USER = {
    id: 1,
  };
  it('스케줄이 존재하지 않으면 400에러와 메시지를 응답한다', async () => {
    typeorm.getRepository = jest.fn().mockReturnValue({
      findOne: jest
        .fn()
        .mockResolvedValueOnce(MOCK_USER)
        .mockResolvedValue(null),
    });

    await loadEvents(req, res, next);

    expect(typeorm.getRepository).toHaveBeenCalledWith(User);
    expect(typeorm.getRepository).toHaveBeenCalledWith(Schedule);
    expect(typeorm.getRepository).not.toHaveBeenCalledWith(Event);
    expect(typeorm.getRepository(User).findOne).toHaveBeenCalled();
    expect(typeorm.getRepository(Schedule).findOne).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.send).toHaveBeenCalledWith('존재하지 않는 스케줄입니다.');
  });

  it('유효한 토큰과 스케줄이 존재한다면 200 응답코드와 Events를 응답한다', async () => {
    const MOCK_SCEHDULE = {
      id: 1,
    };
    const MOCK_EVENTS: IEvent[] = [];
    typeorm.getRepository = jest.fn().mockReturnValue({
      findOne: jest
        .fn()
        .mockResolvedValueOnce(MOCK_USER)
        .mockResolvedValue(MOCK_SCEHDULE),
      find: jest.fn().mockResolvedValue(MOCK_EVENTS),
    });

    await loadEvents(req, res, next);

    expect(typeorm.getRepository).toHaveBeenCalledWith(User);
    expect(typeorm.getRepository(User).findOne).toHaveBeenCalled();
    expect(typeorm.getRepository).toHaveBeenCalledWith(Schedule);
    expect(typeorm.getRepository(Schedule).findOne).toHaveBeenCalled();
    expect(typeorm.getRepository).toHaveBeenCalledWith(Event);
    expect(typeorm.getRepository(Event).find).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith(MOCK_EVENTS);
  });
});

describe('addEvent', () => {
  const MOCK_USER = {
    id: 1,
  };

  const MOCK_SCEHDULE = {
    id: 1,
  };

  const MOCK_NEW_EVENT = {
    id: 1,
  };

  const MOCK_REQUEST_BODY = {
    content: 'test content',
    date: new Date(),
    startTime: new Date().toString(),
    endTime: new Date().toString(),
  };

  const req = mockRequest(MOCK_REQUEST_BODY);

  it('스케줄이 존재하지 않으면 400 에러코드와 메시지를 응답한다', async () => {
    typeorm.getRepository = jest.fn().mockReturnValue({
      findOne: jest
        .fn()
        .mockResolvedValueOnce(MOCK_USER)
        .mockResolvedValue(null),
    });

    await addEvent(req, res, next);

    expect(typeorm.getRepository).toHaveBeenCalledWith(User);
    expect(typeorm.getRepository(User).findOne).toHaveBeenCalled();
    expect(typeorm.getRepository).toHaveBeenCalledWith(Schedule);
    expect(typeorm.getRepository(Schedule).findOne).toHaveBeenCalled();
    expect(typeorm.getRepository).not.toHaveBeenCalledWith(Event);
    expect(res.status).toHaveBeenNthCalledWith(1, 400);
    expect(res.send).toHaveBeenNthCalledWith(1, '존재하지 않는 스케줄입니다.');
  });

  it('유효한 요청일 시, 해당 유저 스케줄에 event를 추가한다.', async () => {
    typeorm.getRepository = jest.fn().mockReturnValue({
      findOne: jest
        .fn()
        .mockResolvedValueOnce(MOCK_USER)
        .mockResolvedValue(MOCK_SCEHDULE),
      create: jest.fn().mockReturnValue(MOCK_NEW_EVENT),
      save: jest.fn().mockImplementation(() => Promise.resolve()),
    });

    await addEvent(req, res, next);

    expect(typeorm.getRepository).toHaveBeenCalledWith(User);
    expect(typeorm.getRepository(User).findOne).toHaveBeenCalled();
    expect(typeorm.getRepository).toHaveBeenCalledWith(Schedule);
    expect(typeorm.getRepository(Schedule).findOne).toHaveBeenCalled();
    expect(typeorm.getRepository).toHaveBeenCalledWith(Event);
    expect(typeorm.getRepository(Event).create).toHaveBeenCalledWith({
      ...MOCK_REQUEST_BODY,
      schedule: MOCK_SCEHDULE,
      startTime: new Date(MOCK_REQUEST_BODY.startTime),
      endTime: new Date(MOCK_REQUEST_BODY.endTime),
    });
    expect(typeorm.getRepository(Event).save).toHaveBeenCalledWith(
      MOCK_NEW_EVENT
    );
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.send).toHaveBeenCalledWith(MOCK_NEW_EVENT);
  });
});

describe('loadEvent', () => {
  const MOCK_USER = {
    id: 1,
  };

  const MOCK_SCEHDULE = {
    id: 1,
  };

  const MOCK_EVENT = {
    id: 1,
  };
  const req = mockRequest(
    {},
    {
      date: new Date(),
      page: 1,
    }
  );

  it('스케줄이 존재하지 않으면 400 에러 코드와 메시지를 응답한다', async () => {
    typeorm.getRepository = jest.fn().mockReturnValue({
      findOne: jest
        .fn()
        .mockResolvedValueOnce(MOCK_USER)
        .mockResolvedValue(null),
    });

    await loadEvent(req, res, next);

    expect(typeorm.getRepository).toHaveBeenCalledWith(User);
    expect(typeorm.getRepository(User).findOne).toHaveBeenCalled();
    expect(typeorm.getRepository).toHaveBeenCalledWith(Schedule);
    expect(typeorm.getRepository(Schedule).findOne).toHaveBeenCalled();
    expect(typeorm.getRepository).not.toHaveBeenCalledWith(Event);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.send).toHaveBeenCalledWith('존재하지 않는 스케줄입니다.');
  });

  it('유효한 요청일 시 주어진 스케줄 및 날짜에 해당하는 event들을 응답한다', async () => {
    typeorm.getRepository = jest.fn().mockReturnValue({
      findOne: jest
        .fn()
        .mockResolvedValueOnce(MOCK_USER)
        .mockResolvedValue(MOCK_SCEHDULE),
      findAndCount: jest.fn().mockResolvedValue([{ ...MOCK_EVENT }, 1]),
    });

    await loadEvent(req, res, next);

    expect(typeorm.getRepository).toHaveBeenCalledWith(User);
    expect(typeorm.getRepository(User).findOne).toHaveBeenCalled();
    expect(typeorm.getRepository).toHaveBeenCalledWith(Schedule);
    expect(typeorm.getRepository(Schedule).findOne).toHaveBeenCalled();
    expect(typeorm.getRepository).toHaveBeenCalledWith(Event);
    expect(typeorm.getRepository(Event).findAndCount).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      eventsWithoutTime: { ...MOCK_EVENT },
      eventsWithoutTimeTotalPages: Math.ceil(1 / 3),
    });
  });
});

describe('loadEventsWithTime', () => {
  const MOCK_USER = {
    id: 1,
  };

  const MOCK_SCEHDULE = {
    id: 1,
  };

  const MOCK_EVENT = {
    id: 1,
    startTime: new Date(),
    endTime: new Date(),
  };
  const req = mockRequest(
    {},
    {
      date: new Date(),
      page: 1,
    }
  );

  it('스케줄이 존재하지 않으면 400 에러 코드와 메시지를 응답한다', async () => {
    typeorm.getRepository = jest.fn().mockReturnValue({
      findOne: jest
        .fn()
        .mockResolvedValueOnce(MOCK_USER)
        .mockResolvedValue(null),
    });

    await loadEvent(req, res, next);

    expect(typeorm.getRepository).toHaveBeenCalledWith(User);
    expect(typeorm.getRepository(User).findOne).toHaveBeenCalled();
    expect(typeorm.getRepository).toHaveBeenCalledWith(Schedule);
    expect(typeorm.getRepository(Schedule).findOne).toHaveBeenCalled();
    expect(typeorm.getRepository).not.toHaveBeenCalledWith(Event);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.send).toHaveBeenCalledWith('존재하지 않는 스케줄입니다.');
  });

  it('유효한 요청일 시 주어진 스케줄 및 날짜에 해당하는 event들을 응답한다', async () => {
    typeorm.getRepository = jest.fn().mockReturnValue({
      findOne: jest
        .fn()
        .mockResolvedValueOnce(MOCK_USER)
        .mockResolvedValue(MOCK_SCEHDULE),
      createQueryBuilder: jest.fn(() => ({
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        addOrderBy: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        getManyAndCount: jest.fn().mockResolvedValue([[{ ...MOCK_EVENT }], 1]),
      })),
    });

    await loadEventsWithTime(req, res, next);

    expect(typeorm.getRepository).toHaveBeenCalledWith(User);
    expect(typeorm.getRepository(User).findOne).toHaveBeenCalled();
    expect(typeorm.getRepository).toHaveBeenCalledWith(Schedule);
    expect(typeorm.getRepository(Schedule).findOne).toHaveBeenCalled();
    expect(typeorm.getRepository).toHaveBeenCalledWith(Event);
    expect(typeorm.getRepository(Event).createQueryBuilder).toHaveBeenCalled();
    expect(res.status).toHaveBeenNthCalledWith(1, 200);
    expect(res.json).toHaveBeenNthCalledWith(1, {
      parsedEventsWithTime: [
        {
          ...MOCK_EVENT,
          startTime: MOCK_EVENT.startTime.toString(),
          endTime: MOCK_EVENT.endTime.toString(),
        },
      ],
      eventsWithTimeTotalPages: Math.ceil(1 / 3),
    });
  });
});
