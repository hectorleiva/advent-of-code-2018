-module(day3_1).
-export([start/0]).

retrieveFileContents(FileName) ->
    {ok, File} = file:open(FileName, [read]),
    Read = file:read(File, 1024 * 1024),
    {ok, Contents} = Read,
    Contents.

splitIntoCollection(FileContents, Separator) ->
    lists:filter(
      fun(X) -> length(X) > 0 end,
      string:split(FileContents, Separator, all)
    ).

convertStringToInt(X) ->
    {IntVal, _} = string:to_integer(X),
    IntVal.

for_x(0, X, Y) -> [[X, Y]];
    for_x(N, X, Y) when N > 0 ->
        [[X, Y] | for_x(N-1, X+1, Y)].

for_y(0, X, Y) -> [[X, Y]];
    for_y(N, X, Y) when N > 0 ->
        [[X, Y] | for_y(N-1, X, Y+1)].

createCoordinateGrid(S_Coords, Size) ->
    [S_X, S_Y] = splitIntoCollection(S_Coords, ","),
    [Size_X, Size_Y] = splitIntoCollection(Size, "x"),

    S_X_I = convertStringToInt(S_X),
    S_Y_I = convertStringToInt(S_Y),

    Size_X_I = (convertStringToInt(Size_X) - 1),
    Size_Y_I = (convertStringToInt(Size_Y) - 1),

    CoordinatesMap = lists:append([for_y(Size_Y_I, X, Y) || [X, Y] <- for_x(Size_X_I, S_X_I, S_Y_I)]),
    CoordinatesMap.

findList(_, [], Accum) -> Accum;
findList(Element, [Item | ListTail], Accum) ->
    case(Item == Element) of
        true -> findList(Element, ListTail, [Item|Accum]);
        false -> findList(Element, ListTail, Accum)
    end.

returnCoordinates(X) -> maps:get(coordinates, X).

findOverlapping(ElfSelection, AllSelections) ->
    Id = maps:get(id, ElfSelection),
    print(Id),
    SelectedCoordinates = returnCoordinates(ElfSelection),
    DeltaSelection = lists:filter(fun(X) -> maps:get(id, X) /= Id end, AllSelections),
    DeltaCoordinates = lists:append([maps:get(coordinates, X) || X <- DeltaSelection]),
    AccCoordinates = [findList(X, DeltaCoordinates, []) || X <- SelectedCoordinates],
    [F || F <- AccCoordinates, F/= []].

print(X) -> io:format("~p~n", [X]).

start() ->
    Contents = retrieveFileContents("collated_input_values_day3_1.txt"),
    Info = splitIntoCollection(Contents, "\n"),
    InfoList = [splitIntoCollection(X, ";") || X <- Info],
    InfoListCoords = [#{id => Id,
                        coordinates => createCoordinateGrid(S_Coords, Size),
                        size => Size} || [Id, S_Coords, Size] <- InfoList],
    Dups = lists:append([findOverlapping(X, InfoListCoords) || X <- InfoListCoords]),
    SqCoveredList = sets:to_list(sets:from_list(Dups)),
    print(length(SqCoveredList)).
