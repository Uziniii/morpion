import Collection from "../../../websocket/server/Classes/Collection";
import { Token } from "../../../websocket/server/Interface/User";
import Room from "../Classes/Room";

interface Storage {
    roomMap: Collection<Token, Room>
}

export default Storage;
