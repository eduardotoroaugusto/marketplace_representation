import 'package:shelf/shelf.dart';

import '../models/arcade_stats.dart';
import '../models/pricing.dart';
import '../viewmodels/arcade_view_model.dart';
import '../viewmodels/view_result.dart';
import 'json_view.dart';

/// Serialização do Cosmo Arcade.
class ArcadeView {
  static Map<String, Object?> statsToJson(ArcadeStats s) => {
        'points': s.points,
        'hiScore': s.hiScore,
        'playsToday': s.playsToday,
        'playsLeft': s.playsLeft,
        'maxPlaysPerDay': ArcadeStats.maxPlaysPerDay,
        'openPlayId': s.openPlayId,
        'conversion': [
          for (final t in pointTiers) {'points': t.points, 'discount': money(t.valueCents)},
        ],
      };

  static Response renderStats(ViewResult<ArcadeStats> result) => render(result, statsToJson);

  static Response renderStarted(ViewResult<({int playId, ArcadeStats stats})> result) =>
      render(result, (r) => {'playId': r.playId, 'stats': statsToJson(r.stats)});

  static Response renderFinished(ViewResult<FinishedPlay> result) =>
      render(result, (r) => {'earned': r.earned, 'stats': statsToJson(r.stats)});
}
