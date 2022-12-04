export enum PacketType {
  SPAWN,
  MOVE,
  DAMAGE,
}

export abstract class Packet {
  abstract type: PacketType;
}
