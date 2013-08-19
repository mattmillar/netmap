# using sample query date '1970-01-01 00:00:00'

SELECT DISTINCT Hosts.hostid, Hosts.lat, Hosts.lon, Hosts.shortname, HostAppearances.network
FROM Hosts INNER JOIN HostAppearances
ON (Hosts.hostid = HostAppearances.host)
WHERE starttime <= '1970-01-01 00:00:00'
AND ('1970-01-01 00:00:00' <= endtime OR endtime IS NULL);