# using sample query date '1970-01-01 00:00:00'

SELECT DISTINCT AHosts.lat AS latA, AHosts.lon AS lonA,
BHosts.lat AS latB, BHosts.lon AS lonB, LinkAppearances.network
FROM Hosts AS AHosts INNER JOIN LinkAppearances INNER JOIN Hosts AS BHosts
ON (AHosts.hostid = LinkAppearances.hostA AND BHosts.hostid = LinkAppearances.hostB)
WHERE starttime <= '1970-01-01 00:00:00'
AND ('1970-01-01 00:00:00' <= endtime OR endtime IS NULL);