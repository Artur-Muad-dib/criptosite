package br.edu.ifpe.recife.labgeo.sigabem.model;

import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

import lombok.Data;

@Data
public class Notification {
	
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Integer id;
	private String app_id;
	private String included_segments;
	private String title;
	private String contents;
	private String notificationType;
	private String remittee;
}
